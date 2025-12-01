package org.example.aiarycproject.domain.threads.service;

import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.threads.entity.ChatThread;
import org.example.aiarycproject.domain.threads.repository.ChatThreadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatThreadService {

    private final ChatThreadRepository threadRepository;

    @Transactional
    public UUID create(String title) {
        ChatThread thread = ChatThread.builder()
                .title(title)
                .status("active")
                .build();
        return threadRepository.save(thread).getId();
    }

    public Optional<ChatThread> get(UUID threadId) {
        return threadRepository.findById(threadId);
    }

    public List<ChatThread> list(String status, int limit, UUID cursor) {
        // 커서 없는 단순 리스트
        return threadRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .limit(limit)
                .toList();
    }

    @Transactional
    public void updateStatus(UUID threadId, String status) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new NoSuchElementException("스레드가 존재하지 않습니다"));
        if (!List.of("active", "archived", "finalized").contains(status)) {
            throw new IllegalArgumentException("잘못된 상태입니다: " + status);
        }
        thread.setStatus(status);
        threadRepository.save(thread);
    }

    @Transactional
    public void delete(UUID threadId) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new NoSuchElementException("스레드가 존재하지 않습니다"));
        threadRepository.delete(thread);
    }
}