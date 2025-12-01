//package org.example.aiarycproject.domain.messages.entity;
//
//import com.fasterxml.jackson.annotation.JsonInclude;
//import com.fasterxml.jackson.annotation.JsonInclude.Include;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.Instant;
//import java.util.UUID;
//
//@Getter @Setter
//@JsonInclude(Include.NON_NULL)
//public class ChatMessage {
//    private UUID id;
//    private UUID threadId;
//    private String role;       // user, assistant, system
//    private String content;
//    private Integer tokenCount;
//    private String status;     // partial, complete, error
//    private String metadata;   // JSON string
//    private Instant createdAt;
//
//    public ChatMessage() {}
//}
package org.example.aiarycproject.domain.messages.entity;

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
public class ChatMessage {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID threadId;

    @Column(nullable = false)
    private String role; // "user" or "assistant"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    private Instant createdAt;
}