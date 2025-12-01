package org.example.aiarycproject.domain.user.web;

import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.user.dto.*;
import org.example.aiarycproject.domain.user.entity.User;
import org.example.aiarycproject.domain.user.service.AuthService;
import org.example.aiarycproject.global.jwt.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;


    /**
     * 회원가입
     */
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {

        try {
            authService.signUp(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new SignUpResponse(
                            request.getUserName(),
                            request.getNickname(),
                            "회원가입이 완료되었습니다."
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(error(400, e.getMessage()));
        }
    }


    /**
     * 로그인 (AccessToken + RefreshToken 발급)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        if (request.getUserName() == null || request.getPassword() == null ||
                request.getUserName().isBlank() || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(error(400, "이름과 비밀번호를 모두 입력해주세요."));
        }

        try {
            TokenResponse response = authService.login(request);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(error(401, "이름 또는 비밀번호가 일치하지 않습니다."));
        }
    }


    /**
     * 본인 정보 조회 — /auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal User user) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "유효하지 않은 토큰입니다."));
        }

        UserMeResponse response = new UserMeResponse(
                user.getId(),
                user.getUserName(),
                user.getNickname()
        );

        return ResponseEntity.ok(response);
    }


    /**
     * 공통 에러 응답 형식 유지
     */
    private static ErrorResponse error(int status, String message) {
        return new ErrorResponse(status, message);
    }
}