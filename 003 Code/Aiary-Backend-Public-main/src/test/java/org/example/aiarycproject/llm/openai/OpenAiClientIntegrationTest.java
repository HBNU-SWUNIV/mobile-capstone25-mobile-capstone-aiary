package org.example.aiarycproject.llm.openai;

import org.example.aiarycproject.llm.LlmClient;
import org.example.aiarycproject.llm.StreamCallback;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

/**
 * OpenAI 통합 테스트
 *
 * 실행 방법:
 * 1. src/test/resources/application.properties에 API 키 설정
 * 2. @Disabled 주석 제거
 * 3. ./gradlew test --tests OpenAiClientIntegrationTest
 *
 * 주의: 실제 OpenAI API를 호출하므로 비용이 발생할 수 있습니다.
 */
//@Disabled("실제 OpenAI API 키가 필요합니다. src/test/resources/application.properties에서 설정 후 @Disabled를 제거하세요.")
@SpringBootTest
class OpenAiClientIntegrationTest {

    @Autowired(required = false)
    private LlmClient openAiLlmClient;

    @BeforeEach
    void setUp() {
        assertNotNull(openAiLlmClient, "OpenAI 클라이언트가 주입되지 않았습니다. src/test/resources/application.properties에 openai.api.key를 설정하세요.");
    }

    @Test
    void testGenerateDiary_withSampleConversation() {
        List<LlmClient.MessageView> context = List.of(
                new LlmClient.MessageView("user", "오늘 회사에서 프로젝트 발표가 있었어요."),
                new LlmClient.MessageView("assistant", "발표는 어떻게 진행되었나요?"),
                new LlmClient.MessageView("user", "떨렸지만 잘 끝냈어요. 팀장님도 칭찬해주셨어요."),
                new LlmClient.MessageView("assistant", "정말 잘하셨네요! 어떤 기분이 드셨나요?"),
                new LlmClient.MessageView("user", "뿌듯하고 자신감이 생겼어요.")
        );

        String diary = openAiLlmClient.generateDiary(context);

        assertNotNull(diary, "일기 생성 결과가 null입니다.");
        assertFalse(diary.isEmpty(), "일기 생성 결과가 비어있습니다.");

        assertTrue(diary.contains("요약"), "일기에 요약이 포함되지 않았습니다.");
        assertTrue(diary.contains("일기"), "일기 본문이 포함되지 않았습니다.");

        System.out.println("=== 생성된 일기 ===");
        System.out.println(diary);
        System.out.println("==================");

        assertTrue(diary.length() > 50, "생성된 일기가 너무 짧습니다.");
    }

    @Test
    void testGenerateDiary_parsesDiaryContent() {
        List<LlmClient.MessageView> context = List.of(
                new LlmClient.MessageView("user", "오늘 친구와 카페에서 수다 떨었어요.")
        );

        String diary = openAiLlmClient.generateDiary(context);

        assertNotNull(diary);
        assertTrue(diary.contains("【요약】"), "요약 섹션이 없습니다.");
        assertTrue(diary.contains("【일기】"), "일기 섹션이 없습니다.");

        String[] parts = diary.split("【일기】");
        assertTrue(parts.length >= 2, "일기가 제대로 파싱되지 않았습니다.");

        String summaryPart = parts[0];
        String contentPart = parts[1];

        assertFalse(summaryPart.trim().isEmpty(), "요약이 비어있습니다.");
        assertFalse(contentPart.trim().isEmpty(), "본문이 비어있습니다.");

        System.out.println("=== 요약 ===");
        System.out.println(summaryPart);
        System.out.println("=== 본문 ===");
        System.out.println(contentPart);
    }

    @Test
    void testStreamReply_withSimpleContext() throws InterruptedException {
        List<LlmClient.MessageView> context = List.of(
                new LlmClient.MessageView("user", "오늘 기분이 좋지 않아요.")
        );

        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<String> fullResponse = new AtomicReference<>("");
        AtomicReference<Throwable> error = new AtomicReference<>();
        StringBuilder deltaBuilder = new StringBuilder();

        openAiLlmClient.streamReply(context, new StreamCallback() {
            @Override
            public void onDelta(String text) {
                deltaBuilder.append(text);
                System.out.print(text);
            }

            @Override
            public void onComplete(String full) {
                fullResponse.set(full);
                System.out.println("\n=== 스트리밍 완료 ===");
                latch.countDown();
            }

            @Override
            public void onError(Throwable t) {
                error.set(t);
                latch.countDown();
            }
        });

        boolean completed = latch.await(30, TimeUnit.SECONDS);
        assertTrue(completed, "스트리밍이 30초 내에 완료되지 않았습니다.");

        assertNull(error.get(), "스트리밍 중 오류 발생: " + (error.get() != null ? error.get().getMessage() : ""));
        assertNotNull(fullResponse.get(), "전체 응답이 null입니다.");
        assertFalse(fullResponse.get().isEmpty(), "전체 응답이 비어있습니다.");

        assertEquals(deltaBuilder.toString(), fullResponse.get(),
                "델타 누적과 최종 응답이 일치하지 않습니다.");

        assertTrue(fullResponse.get().length() > 10, "응답이 너무 짧습니다.");
    }

    @Test
    void testStreamReply_withEmotionalContext() throws InterruptedException {
        List<LlmClient.MessageView> context = List.of(
                new LlmClient.MessageView("user", "시험에서 떨어졌어요."),
                new LlmClient.MessageView("assistant", "많이 실망스러우시겠어요."),
                new LlmClient.MessageView("user", "네, 너무 속상해요.")
        );

        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<String> fullResponse = new AtomicReference<>("");

        openAiLlmClient.streamReply(context, new StreamCallback() {
            @Override
            public void onDelta(String text) {
                System.out.print(text);
            }

            @Override
            public void onComplete(String full) {
                fullResponse.set(full);
                System.out.println("\n=== 감정 공감 응답 완료 ===");
                latch.countDown();
            }

            @Override
            public void onError(Throwable t) {
                fail("스트리밍 중 오류 발생: " + t.getMessage());
                latch.countDown();
            }
        });

        assertTrue(latch.await(30, TimeUnit.SECONDS));
        assertNotNull(fullResponse.get());
        assertTrue(fullResponse.get().length() > 20);
    }

    @Test
    void testGenerateDiary_withEmptyContext() {
        List<LlmClient.MessageView> context = List.of();

        String diary = openAiLlmClient.generateDiary(context);

        assertNotNull(diary);
        assertFalse(diary.isEmpty());

        System.out.println("=== 빈 컨텍스트 일기 ===");
        System.out.println(diary);
    }
}
