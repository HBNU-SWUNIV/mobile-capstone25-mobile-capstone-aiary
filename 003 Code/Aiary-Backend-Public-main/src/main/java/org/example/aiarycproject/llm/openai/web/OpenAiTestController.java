//package org.example.aiarycproject.llm.openai.web;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.media.Content;
//import io.swagger.v3.oas.annotations.media.Schema;
//import io.swagger.v3.oas.annotations.responses.ApiResponse;
//import io.swagger.v3.oas.annotations.responses.ApiResponses;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//import org.example.aiarycproject.llm.LlmClient;
//import org.example.aiarycproject.llm.StreamCallback;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Map;
//import java.util.concurrent.CompletableFuture;
//
//@RestController
//@RequestMapping("/api/openai-test")
//@RequiredArgsConstructor
//@Tag(name = "OpenAI Test", description = "OpenAI 통합 테스트 API")
//public class OpenAiTestController {
//
//    private final LlmClient openAiLlmClient;
//
//    @Operation(summary = "일기 생성 테스트", description = "메시지 컨텍스트를 기반으로 OpenAI를 사용하여 일기를 생성합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "일기 생성 성공"),
//            @ApiResponse(responseCode = "500", description = "일기 생성 실패")
//    })
//    @PostMapping("/diary")
//    public ResponseEntity<?> generateDiary(@RequestBody DiaryRequest request) {
//        try {
//            List<LlmClient.MessageView> context = request.messages().stream()
//                    .map(msg -> new LlmClient.MessageView(msg.role(), msg.content()))
//                    .toList();
//
//            String diary = openAiLlmClient.generateDiary(context);
//
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "diary", diary
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of(
//                    "success", false,
//                    "error", e.getMessage()
//            ));
//        }
//    }
//
//    @Operation(summary = "스트리밍 채팅 테스트", description = "OpenAI를 사용하여 실시간 스트리밍 채팅 응답을 반환합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "스트리밍 시작 성공", content = @Content(mediaType = "text/event-stream"))
//    })
//    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public SseEmitter streamChat(
//            @Parameter(description = "사용자 메시지", required = true)
//            @RequestParam String message) {
//        SseEmitter emitter = new SseEmitter(60000L);
//        StringBuilder accumulated = new StringBuilder();
//
//        CompletableFuture.runAsync(() -> {
//            try {
//                List<LlmClient.MessageView> context = List.of(
//                        new LlmClient.MessageView("user", message)
//                );
//
//                openAiLlmClient.streamReply(context, new StreamCallback() {
//                    @Override
//                    public void onDelta(String text) {
//                        try {
//                            accumulated.append(text);
//                            emitter.send(SseEmitter.event()
//                                    .name("delta")
//                                    .data(text));
//                        } catch (IOException e) {
//                            emitter.completeWithError(e);
//                        }
//                    }
//
//                    @Override
//                    public void onComplete(String full) {
//                        try {
//                            emitter.send(SseEmitter.event()
//                                    .name("done")
//                                    .data(Map.of(
//                                            "fullText", full,
//                                            "length", full.length()
//                                    )));
//                            emitter.complete();
//                        } catch (IOException e) {
//                            emitter.completeWithError(e);
//                        }
//                    }
//
//                    @Override
//                    public void onError(Throwable t) {
//                        try {
//                            emitter.send(SseEmitter.event()
//                                    .name("error")
//                                    .data(Map.of("message", t.getMessage())));
//                        } catch (IOException ignored) {
//                        }
//                        emitter.completeWithError(t);
//                    }
//                });
//            } catch (Exception e) {
//                try {
//                    emitter.send(SseEmitter.event()
//                            .name("error")
//                            .data(Map.of("message", e.getMessage())));
//                } catch (IOException ignored) {
//                }
//                emitter.completeWithError(e);
//            }
//        });
//
//        return emitter;
//    }
//
//    @Operation(summary = "건강 체크", description = "OpenAI 클라이언트 설정 상태를 확인합니다")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "건강 체크 성공")
//    })
//    @GetMapping("/health")
//    public ResponseEntity<?> health() {
//        boolean isConfigured = openAiLlmClient != null;
//
//        return ResponseEntity.ok(Map.of(
//                "status", "ok",
//                "openAiConfigured", isConfigured,
//                "message", isConfigured
//                        ? "OpenAI 클라이언트가 정상적으로 설정되었습니다."
//                        : "OpenAI 클라이언트가 설정되지 않았습니다. API 키를 확인하세요."
//        ));
//    }
//
//    public record DiaryRequest(List<MessageDto> messages) {
//    }
//
//    public record MessageDto(String role, String content) {
//    }
//}

package org.example.aiarycproject.llm.openai.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.llm.LlmClient;
import org.example.aiarycproject.llm.StreamCallback;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/openai-test")
@RequiredArgsConstructor
@Tag(name = "OpenAI Test", description = "OpenAI 통합 테스트 API")
public class OpenAiTestController {

    private final LlmClient openAiLlmClient;

    @Operation(summary = "일기 생성 테스트", description = "메시지 컨텍스트를 기반으로 OpenAI를 사용하여 일기를 생성합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일기 생성 성공"),
            @ApiResponse(responseCode = "500", description = "일기 생성 실패")
    })
    @PostMapping("/diary")
    public ResponseEntity<?> generateDiary(@RequestBody DiaryRequest request) {
        try {
            List<LlmClient.MessageView> context = request.messages().stream()
                    .map(msg -> new LlmClient.MessageView(msg.role(), msg.content()))
                    .toList();

            String diary = openAiLlmClient.generateDiary(context);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "diary", diary
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @Operation(summary = "스트리밍 채팅 테스트", description = "OpenAI를 사용하여 실시간 스트리밍 채팅 응답을 반환합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스트리밍 시작 성공", content = @Content(mediaType = "text/event-stream"))
    })
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(
            @Parameter(description = "사용자 메시지", required = true)
            @RequestParam String message) {

        SseEmitter emitter = new SseEmitter(60000L);
        StringBuilder accumulated = new StringBuilder();

        CompletableFuture.runAsync(() -> {
            try {
                List<LlmClient.MessageView> context = List.of(
                        new LlmClient.MessageView("user", message)
                );

                openAiLlmClient.streamReply(context, new StreamCallback() {
                    @Override
                    public void onDelta(String text) {
                        try {
                            accumulated.append(text);
                            emitter.send(SseEmitter.event()
                                    .name("delta")
                                    .data(Map.of(
                                            "type", "delta",
                                            "text", text
                                    )));
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    }

                    @Override
                    public void onComplete(String full) {
                        try {
                            emitter.send(SseEmitter.event()
                                    .name("done")
                                    .data(Map.of(
                                            "type", "done",
                                            "fullText", full,
                                            "length", full.length(),
                                            "message", "Streaming completed successfully"
                                    )));
                            emitter.complete();
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    }

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
            } catch (Exception e) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("error")
                            .data(Map.of(
                                    "type", "error",
                                    "message", e.getMessage()
                            )));
                } catch (IOException ignored) {}
                emitter.completeWithError(e);
            }
        });

        emitter.onTimeout(() -> emitter.completeWithError(new RuntimeException("Stream timeout")));
        return emitter;
    }

    @Operation(summary = "건강 체크", description = "OpenAI 클라이언트 설정 상태를 확인합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "건강 체크 성공")
    })
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        boolean isConfigured = openAiLlmClient != null;

        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "openAiConfigured", isConfigured,
                "message", isConfigured
                        ? "OpenAI 클라이언트가 정상적으로 설정되었습니다."
                        : "OpenAI 클라이언트가 설정되지 않았습니다. API 키를 확인하세요."
        ));
    }

    public record DiaryRequest(List<MessageDto> messages) {}
    public record MessageDto(String role, String content) {}
}
