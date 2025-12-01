package org.example.aiarycproject.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenResponse {

    private String accessToken;
    private String refreshToken;

    private UserDto user;

    @Getter
    @Builder
    public static class UserDto {
        private Long id;

        @JsonProperty("user_name")
        private String userName;

        private String nickname;
    }
}