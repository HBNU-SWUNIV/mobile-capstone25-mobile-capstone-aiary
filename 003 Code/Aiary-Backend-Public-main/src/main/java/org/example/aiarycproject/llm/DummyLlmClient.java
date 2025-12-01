package org.example.aiarycproject.llm;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service("dummyLlmClient")
public class DummyLlmClient implements LlmClient {
    @Override
    public void streamReply(List<MessageView> context, StreamCallback cb) {
        String user = context.isEmpty() ? "" : context.get(context.size()-1).content();
        String full = "알겠어요! \"" + user + "\" 에 대해 조금 더 들려주세요.";
        try {
            for (char ch : full.toCharArray()) {
                cb.onDelta(String.valueOf(ch));
                Thread.sleep(8);
            }
            cb.onComplete(full);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            cb.onError(e);
        }
    }

    @Override
    public String generateDiary(List<MessageView> context) {
        String body = context.stream()
                .filter(m -> !"system".equals(m.role()))
                .map(m -> (m.role().equals("user") ? "사용자" : "어시스턴트") + ": " + m.content())
                .collect(Collectors.joining("\n"));
        return """
        🧸 오늘의 일기
        오늘 대화 내용을 바탕으로 하루를 돌아봅니다.

        %s

        마무리: 내일은 오늘보다 한 걸음 더!
        """.formatted(body);
    }
}