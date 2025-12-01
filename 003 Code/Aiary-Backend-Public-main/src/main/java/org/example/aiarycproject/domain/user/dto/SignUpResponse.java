package org.example.aiarycproject.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignUpResponse {

    @JsonProperty("user_name")
    private String userName;

    private String nickname;

    private String message;
}