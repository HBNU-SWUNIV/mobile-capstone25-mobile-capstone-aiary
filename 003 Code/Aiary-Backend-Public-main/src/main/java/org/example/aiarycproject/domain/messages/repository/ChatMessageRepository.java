package org.example.aiarycproject.domain.messages.repository;

import org.example.aiarycproject.domain.messages.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByThreadIdOrderByCreatedAtAsc(UUID threadId);

    List<ChatMessage> findByThreadIdAndCreatedAtLessThanOrderByCreatedAtDesc(UUID threadId, java.time.Instant cursor);
}