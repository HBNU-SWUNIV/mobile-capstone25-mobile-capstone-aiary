//package org.example.aiarycproject.domain.messages.web;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.media.Content;
//import io.swagger.v3.oas.annotations.media.Schema;
//import io.swagger.v3.oas.annotations.responses.ApiResponse;
//import io.swagger.v3.oas.annotations.responses.ApiResponses;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import org.example.aiarycproject.domain.messages.service.ChatMessageService;
//import org.example.aiarycproject.llm.StreamCallback;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
//
//import java.io.IOException;
//import java.util.Map;
//import java.util.NoSuchElementException;
//import java.util.UUID;
//import java.util.concurrent.CompletableFuture;
//
//@RestController
//@RequiredArgsConstructor
//@Tag(name = "Chat Message", description = "채팅 메시지 관리 API")
//public class ChatMessageController {
//
//    private final ChatMessageService service;
//
//    @Operation(summary = "사용자 메시지 전송", description = "스레드에 사용자 메시지를 추가합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
//            @ApiResponse(responseCode = "404", description = "스레드를 찾을 수 없음"),
//            @ApiResponse(responseCode = "409", description = "스레드가 finalized 상태")
//    })
//    @PostMapping("/chat/messages")
//    public ResponseEntity<Map<String, String>> postMessage(@RequestBody SendMessageRequest body) {
//        try {
//            var id = service.saveUserMessage(body.getThreadId(), body.getContent());
//            return ResponseEntity.ok(Map.of("messageId", id.toString()));
//        } catch (IllegalStateException e) {
//            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
//        } catch (NoSuchElementException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @Operation(summary = "AI 응답 스트리밍", description = "스레드의 메시지를 기반으로 AI 응답을 실시간 스트리밍합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "스트리밍 시작 성공", content = @Content(mediaType = "text/event-stream")),
//            @ApiResponse(responseCode = "404", description = "스레드를 찾을 수 없음"),
//            @ApiResponse(responseCode = "409", description = "스레드가 finalized 상태")
//    })
//    @GetMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public SseEmitter stream(
//            @Parameter(description = "스레드 ID", required = true)
//            @RequestParam UUID threadId) {
//
//        // 30분 타임아웃 설정으로 안정성 향상
//        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
//        StringBuilder acc = new StringBuilder();
//
//        CompletableFuture.runAsync(() -> {
//            try {
//                service.streamAssistant(threadId, new StreamCallback() {
//                    @Override public void onDelta(String text) {
//                        try {
//                            // 각 토큰을 실시간으로 클라이언트에 전송
//                            emitter.send(SseEmitter.event()
//                                    .name("message")
//                                    .data(text));
//                            acc.append(text);
//                        } catch (IOException e) {
//                            emitter.completeWithError(e);
//                        }
//                    }
//
//                    @Override public void onComplete(String full) {
//                        try {
//                            // 완료 신호 전송
//                            emitter.send(SseEmitter.event()
//                                    .name("done")
//                                    .data("{\"message\":\"AI response completed\"}"));
//                            emitter.complete();
//
//                            // 전체 응답을 데이터베이스에 저장
//                            service.saveAssistant(threadId, acc.toString());
//                        } catch (IOException e) {
//                            emitter.completeWithError(e);
//                        }
//                    }
//
//                    @Override public void onError(Throwable t) {
//                        try {
//                            emitter.send(SseEmitter.event()
//                                    .name("error")
//                                    .data(String.format("{\"message\":\"%s\",\"type\":\"stream_error\"}",
//                                            t.getMessage())));
//                        } catch (IOException ignored) {}
//                        emitter.completeWithError(t);
//                    }
//                });
//            } catch (IllegalStateException ise) {
//                sendErrorAndComplete(emitter, "thread finalized", ise);
//            } catch (NoSuchElementException nse) {
//                sendErrorAndComplete(emitter, "thread not found", nse);
//            } catch (Exception e) {
//                sendErrorAndComplete(emitter, "unexpected error", e);
//            }
//        });
//
//        // 연결 종료 시 리소스 정리
//        emitter.onCompletion(() -> {
//            // 필요한 경우 여기에 리소스 정리 로직 추가
//        });
//
//        emitter.onTimeout(() -> {
//            emitter.completeWithError(new RuntimeException("Stream timeout"));
//        });
//
//        return emitter;
//    }
//
//    private void sendErrorAndComplete(SseEmitter emitter, String message, Throwable cause) {
//        try {
//            emitter.send(SseEmitter.event()
//                    .name("error")
//                    .data(String.format("{\"message\":\"%s\",\"type\":\"%s\"}",
//                            message, cause.getClass().getSimpleName())));
//        } catch (IOException ignored) {}
//        emitter.completeWithError(cause);
//    }
//
//    @Data
//    public static class SendMessageRequest {
//        private UUID threadId;
//        private String content;
//    }
//
//    @Operation(summary = "메시지 목록 조회", description = "특정 스레드의 메시지 목록을 페이지네이션으로 조회합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "메시지 목록 조회 성공")
//    })
//    @GetMapping("/threads/{threadId}/messages")
//    public Map<String, Object> listMessages(
//            @Parameter(description = "스레드 ID", required = true)
//            @PathVariable UUID threadId,
//            @Parameter(description = "조회할 항목 수 (최대 100)", example = "50")
//            @RequestParam(defaultValue = "50") int limit,
//            @Parameter(description = "페이지네이션 커서 (이전 응답의 nextCursor 값)")
//            @RequestParam(required = false) UUID cursor
//    ) {
//        int effLimit = Math.max(1, Math.min(limit, 100));
//        var items = service.listMessages(threadId, effLimit, cursor);
//
//        String nextCursor = (items.size() == effLimit)
//                ? items.get(items.size() - 1).getId().toString()
//                : null;
//
//        Map<String, Object> resp = new java.util.HashMap<>();
//        resp.put("items", items);
//        if (nextCursor != null) resp.put("nextCursor", nextCursor);
//        return resp;
//    }
//
//    @Operation(summary = "메시지 수정", description = "특정 메시지의 내용을 수정합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "메시지 수정 성공"),
//            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
//            @ApiResponse(responseCode = "404", description = "메시지를 찾을 수 없음"),
//            @ApiResponse(responseCode = "409", description = "스레드가 finalized 상태")
//    })
//    @PatchMapping("/chat/messages/{messageId}")
//    public ResponseEntity<?> patchMessage(
//            @Parameter(description = "메시지 ID", required = true)
//            @PathVariable UUID messageId,
//            @RequestBody Map<String, String> body) {
//        try {
//            String content = body.get("content");
//            var updated = service.updateMessage(messageId, content);
//            return ResponseEntity.ok(updated);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        } catch (IllegalStateException e) {
//            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
//        } catch (NoSuchElementException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @Operation(summary = "메시지 삭제", description = "특정 메시지를 삭제합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "204", description = "메시지 삭제 성공"),
//            @ApiResponse(responseCode = "404", description = "메시지를 찾을 수 없음"),
//            @ApiResponse(responseCode = "409", description = "스레드가 finalized 상태")
//    })
//    @DeleteMapping("/chat/messages/{messageId}")
//    public ResponseEntity<?> deleteMessage(
//            @Parameter(description = "메시지 ID", required = true)
//            @PathVariable UUID messageId) {
//        try {
//            service.deleteMessage(messageId);
//            return ResponseEntity.noContent().build();
//        } catch (IllegalStateException e) {
//            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
//        } catch (NoSuchElementException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//}
package org.example.aiarycproject.domain.messages.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.messages.service.ChatMessageService;
import org.example.aiarycproject.llm.StreamCallback;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequiredArgsConstructor
@Tag(name = "Chat Message", description = "채팅 메시지 관리 API")
public class ChatMessageController {

    private final ChatMessageService service;

    // 사용자 메시지 전송
    @PostMapping("/chat/messages")
    public ResponseEntity<Map<String, String>> postMessage(@RequestBody SendMessageRequest body) {
        try {
            var id = service.saveUserMessage(body.getThreadId(), body.getContent());
            return ResponseEntity.ok(Map.of("messageId", id.toString()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // AI 응답 스트리밍
    @GetMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@RequestParam UUID threadId) {
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
        StringBuilder acc = new StringBuilder();

        CompletableFuture.runAsync(() -> {
            try {
                service.streamAssistant(threadId, new StreamCallback() {

                    // 🔹 delta(토큰 단위) 전송
                    @Override
                    public void onDelta(String text) {
                        try {
                            emitter.send(SseEmitter.event()
                                    .name("delta")
                                    .data(Map.of(
                                            "type", "delta",
                                            "text", text
                                    )));
                            acc.append(text);
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    }

                    // 🔹 전체 응답 완료 시
                    @Override
                    public void onComplete(String full) {
                        try {
                            emitter.send(SseEmitter.event()
                                    .name("done")
                                    .data(Map.of(
                                            "type", "done",
                                            "message", "AI response completed",
                                            "fullText", full
                                    )));
                            // DB 저장
                            service.saveAssistant(threadId, acc.toString());
                            emitter.complete();
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    }

                    // 🔹 에러 처리
                    @Override
                    public void onError(Throwable t) {
                        try {
                            emitter.send(SseEmitter.event()
                                    .name("error")
                                    .data(Map.of(
                                            "type", "error",
                                            "message", t.getMessage()
                                    )));
                        } catch (IOException ignored) {}
                        emitter.completeWithError(t);
                    }
                });
            } catch (IllegalStateException ise) {
                sendErrorAndComplete(emitter, "thread finalized", ise);
            } catch (NoSuchElementException nse) {
                sendErrorAndComplete(emitter, "thread not found", nse);
            } catch (Exception e) {
                sendErrorAndComplete(emitter, "unexpected error", e);
            }
        });

        emitter.onTimeout(() -> emitter.completeWithError(new RuntimeException("Stream timeout")));
        return emitter;
    }

    private void sendErrorAndComplete(SseEmitter emitter, String message, Throwable cause) {
        try {
            emitter.send(SseEmitter.event()
                    .name("error")
                    .data(Map.of(
                            "type", "error",
                            "message", message,
                            "cause", cause.getClass().getSimpleName()
                    )));
        } catch (IOException ignored) {}
        emitter.completeWithError(cause);
    }

    @Data
    public static class SendMessageRequest {
        private UUID threadId;
        private String content;
    }

    // 메시지 목록 조회
    @GetMapping("/threads/{threadId}/messages")
    public Map<String, Object> listMessages(
            @PathVariable UUID threadId,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) UUID cursor
    ) {
        int effLimit = Math.max(1, Math.min(limit, 100));
        var items = service.listMessages(threadId, effLimit, cursor);

        String nextCursor = (items.size() == effLimit)
                ? items.get(items.size() - 1).getId().toString()
                : null;

        Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("items", items);
        if (nextCursor != null) resp.put("nextCursor", nextCursor);
        return resp;
    }

    // 메시지 수정
    @PatchMapping("/chat/messages/{messageId}")
    public ResponseEntity<?> patchMessage(
            @PathVariable UUID messageId,
            @RequestBody Map<String, String> body) {
        try {
            String content = body.get("content");
            var updated = service.updateMessage(messageId, content);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 메시지 삭제
    @DeleteMapping("/chat/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable UUID messageId) {
        try {
            service.deleteMessage(messageId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
