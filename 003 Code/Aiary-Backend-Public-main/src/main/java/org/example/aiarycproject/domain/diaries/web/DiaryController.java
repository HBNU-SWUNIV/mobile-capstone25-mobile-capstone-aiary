package org.example.aiarycproject.domain.diaries.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.diaries.entity.Diary;
import org.example.aiarycproject.domain.diaries.service.DiaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
@Tag(name = "Diary", description = "일기 관리 API")
public class DiaryController {

    private final DiaryService service;

    // 1. 기존 일기 생성 API
    @Operation(summary = "일기 생성", description = "스레드의 메시지를 기반으로 일기를 생성합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일기 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "스레드를 찾을 수 없음")
    })
    @PostMapping("/diaries")
    public Map<String, Object> create(@RequestBody CreateDiaryRequest body) {
        var id = service.createFromThread(body.getThreadId(), body.getTitle(), body.getMood());
        return Map.of("diaryId", id.toString());
    }

    // 2. 기존 상세 조회 API
    @Operation(summary = "일기 조회", description = "특정 일기의 상세 정보를 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일기 조회 성공"),
            @ApiResponse(responseCode = "404", description = "일기를 찾을 수 없음")
    })
    @GetMapping("/diaries/{diaryId}")
    public ResponseEntity<Diary> get(
            @Parameter(description = "일기 ID", required = true)
            @PathVariable UUID diaryId) {
        return service.get(diaryId).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. 기존 스레드 기반 페이징 목록 조회 API
    @Operation(summary = "일기 목록 조회", description = "특정 스레드의 일기 목록을 페이지네이션으로 조회합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "일기 목록 조회 성공")
    })
    @GetMapping("/diaries")
    public Map<String, Object> list(
            @Parameter(description = "스레드 ID", required = true)
            @RequestParam UUID threadId,
            @Parameter(description = "조회할 항목 수 (최대 100)", example = "20")
            @RequestParam(defaultValue = "20") int limit,
            @Parameter(description = "페이지네이션 커서 (이전 응답의 nextCursor 값)")
            @RequestParam(required = false) UUID cursor
    ) {
        var items = service.listByThread(threadId, limit, cursor);
        int effLimit = Math.max(1, Math.min(limit, 100));
        String nextCursor = (items.size() == effLimit)
                ? items.get(items.size() - 1).getId().toString()
                : null;

        Map<String, Object> resp = new HashMap<>();
        resp.put("items", items);
        if (nextCursor != null) resp.put("nextCursor", nextCursor);
        return resp;
    }

    // 신규 API 1. 감정 리포트 조회
    @Operation(summary = "오늘의 감정 리포트", description = "특정 일기의 감정 분석 결과만 조회합니다")
    @GetMapping("/diaries/{diaryId}/emotion")
    public ResponseEntity<?> getEmotion(@PathVariable UUID diaryId) {

        return service.get(diaryId)
                .map(diary -> {
                    if (diary.getEmotions() == null) {
                        return ResponseEntity.noContent().build();
                    }

                    DiaryEmotionResponse resp = new DiaryEmotionResponse();
                    resp.setDiaryId(diary.getId());
                    resp.setEmotions(diary.getEmotions());
                    resp.setDominantEmotion(diary.getDominantEmotion());
                    resp.setOverallMoodScore(
                            diary.getOverallMoodScore() != null
                                    ? diary.getOverallMoodScore().doubleValue()
                                    : null
                    );
                    resp.setRecommendation(diary.getRecommendation());
                    resp.setAnalyzedAt(diary.getAnalyzedAt());
                    resp.setCreatedAt(diary.getCreatedAt());

                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 신규 API 2.전체 일기 목록 조회 (요약)
    // ============================
    @Operation(summary = "전체 일기 목록", description = "전체 일기를 요약 정보로 조회합니다")
    @GetMapping("/diaries/all")
    public List<DiaryListItem> listAll() {
        List<Diary> diaries = service.getAll();

        List<DiaryListItem> result = new ArrayList<>();
        for (Diary d : diaries) {
            DiaryListItem item = new DiaryListItem();
            item.setId(d.getId());
            item.setSummary(d.getSummary());
            item.setDominantEmotion(d.getDominantEmotion());
            item.setCreatedAt(d.getCreatedAt());
            result.add(item);
        }
        return result;
    }

    // 요청 DTO 그대로 유지
    @Data
    public static class CreateDiaryRequest {
        private UUID threadId;
        private String title;   // optional
        private String mood;    // optional
    }

    // 감정 리포트 응답 DTO
    @Data
    public static class DiaryEmotionResponse {
        private UUID diaryId;
        private Map<String, Double> emotions;
        private String dominantEmotion;
        private Double overallMoodScore;
        private String recommendation;
        private LocalDateTime analyzedAt;
        private LocalDateTime createdAt;
    }

    // 전체 목록 요약 DTO
    @Data
    public static class DiaryListItem {
        private UUID id;
        private String summary;
        private String dominantEmotion;
        private LocalDateTime createdAt;
    }
}