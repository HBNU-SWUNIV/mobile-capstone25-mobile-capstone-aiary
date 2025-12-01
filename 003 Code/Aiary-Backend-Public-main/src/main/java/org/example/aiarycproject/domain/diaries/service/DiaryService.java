package org.example.aiarycproject.domain.diaries.service;

import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.diaries.entity.Diary;
import org.example.aiarycproject.domain.diaries.repository.DiaryRepository;
import org.example.aiarycproject.domain.messages.service.ChatMessageService;
import org.example.aiarycproject.llm.LlmClient;
import org.example.aiarycproject.llm.LlmClient.MessageView;
import org.example.aiarycproject.llm.openai.OpenAiResponseParser;
import org.example.aiarycproject.llm.openai.PromptManager;
import org.example.aiarycproject.llm.openai.DiaryContent;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final ChatMessageService messageService; // 메시지 조회에 필요
    private final LlmClient llmClient;               // OpenAI 연동
    private final PromptManager promptManager;       // 메시지 구성
    private final OpenAiResponseParser parser;       // 응답 파싱

    public UUID createFromThread(UUID threadId, String title, String mood) {
        // 1. 메시지 히스토리 가져오기
        List<MessageView> context = messageService.getMessageViewsByThread(threadId);

        // 2. LLM 프롬프트 구성
        List<MessageView> messages = promptManager.buildDiaryGenerationMessages(context);

        // 3. OpenAI 호출
        String result = llmClient.generateDiary(messages);

        // 4. JSON 응답 파싱
        DiaryContent diaryContent = parser.parseDiaryContent(result);

        // 5. Diary 저장 (감정 분석 포함)
        Diary diary = Diary.builder()
                .threadId(threadId)
                .title(title)
                .mood(mood)
                .content(diaryContent.getContent())
                .summary(diaryContent.getSummary())

                // ============================
                // 감정 분석 필드 저장
                // ============================
                .emotions(diaryContent.getEmotions())
                .dominantEmotion(diaryContent.getDominantEmotion())
                .overallMoodScore(
                        diaryContent.getOverallMoodScore() != null
                                ? BigDecimal.valueOf(diaryContent.getOverallMoodScore())
                                : null
                )
                .recommendation(diaryContent.getRecommendation())
                .analyzedAt(java.time.LocalDateTime.now())
                // ============================

                .build();

        return diaryRepository.save(diary).getId();
    }

    public Optional<Diary> get(UUID diaryId) {
        return diaryRepository.findById(diaryId);
    }

    public List<Diary> listByThread(UUID threadId, int limit, UUID cursor) {
        if (cursor != null) {
            return diaryRepository.findByThreadIdAndIdGreaterThanOrderByIdAsc(threadId, cursor)
                    .stream()
                    .limit(limit)
                    .toList();
        } else {
            return diaryRepository.findByThreadIdOrderByIdAsc(threadId)
                    .stream()
                    .limit(limit)
                    .toList();
        }
    }
    public List<Diary> getAll() {
        return diaryRepository.findAll();
    }
}