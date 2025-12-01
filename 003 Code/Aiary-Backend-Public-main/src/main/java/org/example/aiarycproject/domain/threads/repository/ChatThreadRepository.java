package org.example.aiarycproject.domain.threads.repository;

import org.example.aiarycproject.domain.threads.entity.ChatThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatThreadRepository extends JpaRepository<ChatThread, UUID> {

    List<ChatThread> findByStatusAndIdLessThanOrderByCreatedAtDesc(String status, UUID cursor);
    List<ChatThread> findByStatusOrderByCreatedAtDesc(String status);
}