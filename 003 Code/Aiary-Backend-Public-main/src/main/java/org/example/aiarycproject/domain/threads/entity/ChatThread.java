package org.example.aiarycproject.domain.threads.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatThread {

    @Id
    @GeneratedValue
    private UUID id;

    private String title; // optional

    @Column(nullable = false)
    private String status; // "active" | "archived" | "finalized"

    @CreationTimestamp
    private Instant createdAt;
}