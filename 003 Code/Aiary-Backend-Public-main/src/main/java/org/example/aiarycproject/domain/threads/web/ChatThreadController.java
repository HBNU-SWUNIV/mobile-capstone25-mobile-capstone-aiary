package org.example.aiarycproject.domain.threads.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.threads.entity.ChatThread;
import org.example.aiarycproject.domain.threads.service.ChatThreadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat/threads")
@Tag(name = "Chat Thread", description = "채팅 스레드 관리 API")
public class ChatThreadController {

    private final ChatThreadService service;

    @Operation(summary = "스레드 생성", description = "새로운 채팅 스레드를 생성합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스레드 생성 성공")
    })
    @PostMapping
    public Map<String, Object> create(@RequestBody(required = false) CreateThreadRequest body) {
        String title = (body != null) ? body.getTitle() : null;
        UUID id = service.create(title);
        return Map.of("threadId", id.toString());
    }

    @Operation(summary = "스레드 조회", description = "특정 스레드의 상세 정보를 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스레드 조회 성공"),
            @ApiResponse(responseCode = "404", description = "스레드를 찾을 수 없음")
    })
    @GetMapping("/{threadId}")
    public ResponseEntity<ChatThread> get(
            @Parameter(description = "스레드 ID", required = true)
            @PathVariable UUID threadId) {
        return service.get(threadId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "스레드 목록 조회", description = "상태별 스레드 목록을 페이지네이션으로 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스레드 목록 조회 성공")
    })
    @GetMapping
    public Map<String, Object> list(
            @Parameter(description = "스레드 상태 (active/archived)", example = "active")
            @RequestParam(defaultValue = "active") String status,
            @Parameter(description = "조회할 항목 수 (최대 100)", example = "20")
            @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "페이지네이션 커서 (이전 응답의 nextCursor 값)")
            @RequestParam(required = false) UUID cursor
    ) {
        List<ChatThread> items = service.list(status, limit, cursor);

        int effLimit = Math.max(1, Math.min(limit, 100));
        String nextCursor = (items.size() == effLimit)
                ? items.get(items.size() - 1).getId().toString()
                : null;

        Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("items", items);
        if (nextCursor != null) resp.put("nextCursor", nextCursor); // <-- null이면 안 넣음
        return resp;
    }

    @Operation(summary = "스레드 상태 변경", description = "스레드의 상태를 변경합니다 (active/archived)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "스레드를 찾을 수 없음")
    })
    @PatchMapping("/{threadId}")
    public ResponseEntity<?> updateStatus(
            @Parameter(description = "스레드 ID", required = true)
            @PathVariable UUID threadId, 
            @RequestBody UpdateStatusRequest body) {
        try {
            service.updateStatus(threadId, body.getStatus());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "스레드 삭제", description = "특정 스레드를 삭제합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "스레드 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "스레드를 찾을 수 없음")
    })
    @DeleteMapping("/{threadId}")
    public ResponseEntity<?> delete(
            @Parameter(description = "스레드 ID", required = true)
            @PathVariable UUID threadId) {
        try {
            service.delete(threadId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Request DTOs (심플하게 내부 클래스로)
    @Data public static class CreateThreadRequest { private String title; }
    @Data public static class UpdateStatusRequest { private String status; }
}