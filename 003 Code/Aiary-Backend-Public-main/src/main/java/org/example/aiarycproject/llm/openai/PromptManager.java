package org.example.aiarycproject.llm.openai;

import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.llm.LlmClient.MessageView;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PromptManager {

    private final SystemPromptProvider promptProvider;

    public List<MessageView> buildDiaryGenerationMessages(List<MessageView> conversationContext) {
        List<MessageView> messages = new ArrayList<>();

        messages.add(new MessageView("system", promptProvider.getDiaryGenerationPrompt()));

        String userContextPrompt = buildConversationSummary(conversationContext);
        messages.add(new MessageView("user", userContextPrompt));

        return messages;
    }

    public List<MessageView> buildStreamChatMessages(List<MessageView> conversationContext) {
        List<MessageView> messages = new ArrayList<>();

        messages.add(new MessageView("system", promptProvider.getStreamChatPrompt()));

        messages.addAll(conversationContext);

        return messages;
    }

    private String buildConversationSummary(List<MessageView> context) {
        if (context.isEmpty()) {
            return "대화 내역이 없습니다.";
        }

        StringBuilder summary = new StringBuilder();
        summary.append("다음은 사용자와 AI의 대화 내역입니다. 이를 바탕으로 일기를 작성해주세요.\n\n");

        for (MessageView msg : context) {
            String speaker = msg.role().equals("user") ? "사용자" : "AI";
            summary.append(String.format("[%s]: %s\n", speaker, msg.content()));
        }

        summary.append("\n위 대화를 바탕으로 사용자의 관점에서 독백형 일기를 작성해주세요.");

        return summary.toString();
    }
}
