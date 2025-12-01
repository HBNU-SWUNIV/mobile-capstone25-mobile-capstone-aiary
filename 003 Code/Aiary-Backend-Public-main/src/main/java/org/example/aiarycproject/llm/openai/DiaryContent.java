package org.example.aiarycproject.llm.openai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaryContent {
    private String content;            // 일기 본문
    private String summary;            // 요약

    // 감정 분석 필드

    // emotions는 JSON 그대로 문자열 보관 (Map/JsonNode 쓰는 것보다 파싱 안정적)
    private Map<String, Double> emotions;           // {"joy":0.2,"sadness":0.1,...}

    @JsonProperty("dominant_emotion")
    private String dominantEmotion;    // joy, sadness 등
    @JsonProperty("overall_mood_score")
    private Double overallMoodScore;   // 감정 종합 점수
    private String recommendation;     // 감정 기반 메시지
}