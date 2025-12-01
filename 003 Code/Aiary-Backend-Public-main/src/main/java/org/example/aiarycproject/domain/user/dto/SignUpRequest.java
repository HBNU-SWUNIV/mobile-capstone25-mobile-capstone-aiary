package org.example.aiarycproject.domain.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {

    @JsonProperty("user_name")
    private String userName;

    private String password;
    private String nickname;
}