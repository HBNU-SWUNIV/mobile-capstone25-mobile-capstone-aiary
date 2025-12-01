package org.example.aiarycproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.aiarycproject.domain.diaries.entity.Diary;
import org.example.aiarycproject.domain.diaries.service.DiaryService;
import org.example.aiarycproject.domain.messages.service.ChatMessageService;
import org.example.aiarycproject.domain.threads.service.ChatThreadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChatFlowIntegrationTest {

    @Autowired
    private ChatThreadService threadService;

    @Autowired
    private ChatMessageService messageService;

    @Autowired
    private DiaryService diaryService;

    @Test
    void testFullChatFlow_createThread_chat_summarize_retrieve() throws Exception {
        System.out.println("\n========================================");
        System.out.println("통합 테스트 시작: 채팅방 생성 → 대화 → 요약 → 조회");
        System.out.println("========================================\n");

        UUID threadId = threadService.create("통합 테스트 채팅방");
        System.out.println("✅ 1단계: 채팅방 생성 완료 - threadId: " + threadId);
        assertNotNull(threadId);
        Thread.sleep(1000);

        messageService.saveUserMessage(threadId, "오늘 회사에서 중요한 프레젠테이션이 있었어요.");
        System.out.println("✅ 2단계: 사용자 메시지 1 전송 완료");
        Thread.sleep(1000);

        messageService.saveAssistant(threadId, "프레젠테이션이 어떻게 진행되었나요? 긴장되셨을 것 같네요.");
        System.out.println("✅ 3단계: AI 응답 1 저장 완료");
        Thread.sleep(1000);

        messageService.saveUserMessage(threadId, "네, 긴장했지만 잘 마쳤어요. 상사분께서 칭찬해주셨어요!");
        System.out.println("✅ 4단계: 사용자 메시지 2 전송 완료");
        Thread.sleep(1000);

        messageService.saveAssistant(threadId, "정말 잘하셨네요! 칭찬받으시니 기분이 어떠셨나요?");
        System.out.println("✅ 5단계: AI 응답 2 저장 완료");
        Thread.sleep(1000);

        messageService.saveUserMessage(threadId, "정말 뿌듯했고, 자신감도 생긴 하루였어요.");
        System.out.println("✅ 6단계: 사용자 메시지 3 전송 완료");
        Thread.sleep(1000);

        messageService.saveAssistant(threadId, "멋진 하루를 보내셨네요. 자신감은 정말 중요한 것 같아요!");
        System.out.println("✅ 7단계: AI 응답 3 저장 완료");
        Thread.sleep(1000);

        var messages = messageService.listMessages(threadId, 50, null);
        System.out.println("✅ 8단계: 메시지 목록 조회 완료 (총 " + messages.size() + "개)");
        assertTrue(messages.size() >= 6, "메시지가 6개 이상이어야 합니다");
        Thread.sleep(1500);

        UUID diaryId = diaryService.createFromThread(threadId, "성공적인 프레젠테이션", "뿌듯함");
        System.out.println("✅ 9단계: 일기 생성 완료 - diaryId: " + diaryId);
        assertNotNull(diaryId);
        Thread.sleep(3000);

        Diary diary = diaryService.get(diaryId).orElseThrow();
        System.out.println("✅ 10단계: 일기 조회 완료");
        System.out.println("\n========================================");
        System.out.println("생성된 일기 내용:");
        System.out.println("========================================");
        System.out.println("제목: " + diary.getTitle());
        System.out.println("기분: " + diary.getMood());
        System.out.println("\n--- 요약 ---");
        System.out.println(diary.getSummary());
        System.out.println("\n--- 본문 ---");
        System.out.println(diary.getContent());
        System.out.println("========================================\n");

        assertNotNull(diary.getSummary(), "요약이 생성되지 않았습니다");
        assertNotNull(diary.getContent(), "일기 본문이 생성되지 않았습니다");
        assertFalse(diary.getSummary().isEmpty(), "요약이 비어있습니다");
        assertFalse(diary.getContent().isEmpty(), "일기 본문이 비어있습니다");

        System.out.println("✅ 통합 테스트 완료: 모든 단계 성공\n");
    }
}
