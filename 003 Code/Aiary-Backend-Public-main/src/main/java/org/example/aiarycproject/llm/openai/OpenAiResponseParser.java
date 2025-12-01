package org.example.aiarycproject.llm.openai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OpenAiResponseParser {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public DiaryContent parseDiaryContent(String jsonResponse) {
        try {
            System.out.println("=== OpenAI Raw Response ===");
            System.out.println(jsonResponse);
            System.out.println("=========================");

            String cleanedJson = extractJsonFromResponse(jsonResponse);

            System.out.println("=== Cleaned JSON ===");
            System.out.println(cleanedJson);
            System.out.println("===================");

            // 기본 필드(content, summary) 매핑
            DiaryContent diaryContent = objectMapper.readValue(cleanedJson, DiaryContent.class);

            // 감정 필드 파싱
            JsonNode root = objectMapper.readTree(cleanedJson);

            // emotions: JSON object → Map<String, Double>
            if (root.has("emotions")) {
                Map<String, Double> emotionsMap = objectMapper.convertValue(
                        root.get("emotions"),
                        new TypeReference<Map<String, Double>>() {}
                );
                diaryContent.setEmotions(emotionsMap);
            }

            if (root.has("dominant_emotion")) {
                diaryContent.setDominantEmotion(root.get("dominant_emotion").asText());
            }

            if (root.has("overall_mood_score")) {
                diaryContent.setOverallMoodScore(root.get("overall_mood_score").asDouble());
            }

            if (root.has("recommendation")) {
                diaryContent.setRecommendation(root.get("recommendation").asText());
            }

            return diaryContent;

        } catch (Exception e) {
            System.out.println("=== Parse Error ===");
            System.out.println("Error: " + e.getMessage());
            System.out.println("==================");
            return createFallbackDiary(jsonResponse, e);
        }
    }

    private String extractJsonFromResponse(String response) {
        response = response.trim();

        if (response.startsWith("```json")) {
            response = response.substring(7);
        } else if (response.startsWith("```")) {
            response = response.substring(3);
        }

        if (response.endsWith("```")) {
            response = response.substring(0, response.length() - 3);
        }

        response = response.trim();

        int jsonStart = response.indexOf('{');
        int jsonEnd = response.lastIndexOf('}');

        if (jsonStart != -1 && jsonEnd != -1 && jsonStart < jsonEnd) {
            response = response.substring(jsonStart, jsonEnd + 1);
        }

        return response;
    }

    private DiaryContent createFallbackDiary(String rawResponse, Exception e) {
        String content = rawResponse.length() > 500
                ? rawResponse.substring(0, 500) + "..."
                : rawResponse;

        String summary = "일기 생성 중 오류가 발생했습니다: " + e.getMessage();

        return new DiaryContent(content, summary, null, null, null, null);
    }
}