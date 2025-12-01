package org.example.aiarycproject.domain.messages.service;

import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.messages.entity.ChatMessage;
import org.example.aiarycproject.domain.messages.repository.ChatMessageRepository;
import org.example.aiarycproject.domain.threads.repository.ChatThreadRepository;
import org.example.aiarycproject.llm.LlmClient;
import org.example.aiarycproject.llm.StreamCallback;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository messageRepo;
    private final ChatThreadRepository threadRepo; // finalize 상태 확인용
    private final LlmClient llmClient;

    @Transactional
    public UUID saveUserMessage(UUID threadId, String content) {
        checkThreadEditable(threadId);
        ChatMessage message = ChatMessage.builder()
                .threadId(threadId)
                .role("user")
                .content(content)
                .build();
        return messageRepo.save(message).getId();
    }

    @Transactional
    public void saveAssistant(UUID threadId, String content) {
        ChatMessage message = ChatMessage.builder()
                .threadId(threadId)
                .role("assistant")
                .content(content)
                .build();
        messageRepo.save(message);
    }

    public List<ChatMessage> listMessages(UUID threadId, int limit, UUID cursorId) {
        if (cursorId != null) {
            ChatMessage cursor = messageRepo.findById(cursorId)
                    .orElseThrow(() -> new NoSuchElementException("Cursor not found"));
            return messageRepo.findByThreadIdAndCreatedAtLessThanOrderByCreatedAtDesc(threadId, cursor.getCreatedAt())
                    .stream()
                    .limit(limit)
                    .toList();
        } else {
            return messageRepo.findByThreadIdOrderByCreatedAtAsc(threadId)
                    .stream()
                    .limit(limit)
                    .toList();
        }
    }

    @Transactional
    public ChatMessage updateMessage(UUID messageId, String newContent) {
        ChatMessage msg = messageRepo.findById(messageId)
                .orElseThrow();
        checkThreadEditable(msg.getThreadId());
        msg.setContent(newContent);
        return messageRepo.save(msg);
    }

    @Transactional
    public void deleteMessage(UUID messageId) {
        ChatMessage msg = messageRepo.findById(messageId)
                .orElseThrow();
        checkThreadEditable(msg.getThreadId());
        messageRepo.delete(msg);
    }

    public void streamAssistant(UUID threadId, StreamCallback callback) {
        checkThreadEditable(threadId);
        List<LlmClient.MessageView> context = getMessageViewsByThread(threadId);
        llmClient.streamReply(context, callback);
    }

    public List<LlmClient.MessageView> getMessageViewsByThread(UUID threadId) {
        return messageRepo.findByThreadIdOrderByCreatedAtAsc(threadId)
                .stream()
                .map(m -> new LlmClient.MessageView(m.getRole(), m.getContent()))
                .toList();
    }

    private void checkThreadEditable(UUID threadId) {
        var thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new NoSuchElementException("스레드를 찾을 수 없습니다"));
        if ("finalized".equals(thread.getStatus())) {
            throw new IllegalStateException("이미 완료된 스레드입니다");
        }
    }
}