package org.example.aiarycproject.domain.diaries.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diary {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID threadId;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String mood;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    // ============================
    // 감정 분석 필드 추가
    // ============================

    // emotions는 JSONB → 문자열로 저장하는 방식 사용 (Spring이 알아서 JSONB로 넣어줌)
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Double> emotions;

    @Column(length = 30)
    private String dominantEmotion;

    @Column(precision = 4, scale = 3)
    private BigDecimal overallMoodScore;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    private LocalDateTime analyzedAt;
    // ============================

    @CreationTimestamp
    private LocalDateTime createdAt;
}