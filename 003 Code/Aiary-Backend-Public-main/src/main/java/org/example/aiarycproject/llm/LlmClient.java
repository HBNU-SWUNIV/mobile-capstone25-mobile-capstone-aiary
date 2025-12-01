package org.example.aiarycproject.llm;

import java.util.List;

public interface LlmClient {
    void streamReply(List<MessageView> context, StreamCallback cb);

    // 나중에 OpenAI 붙일 때 이 메서드만 실제 호출로 교체
    String generateDiary(List<MessageView> context);

    record MessageView(String role, String content) {}
}