package org.example.aiarycproject.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.user.dto.*;
import org.example.aiarycproject.domain.user.entity.User;
import org.example.aiarycproject.domain.user.repository.UserRepository;
import org.example.aiarycproject.global.jwt.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    /**
     * 로그인 인증만 수행 (Boolean 판단)
     */
    public boolean authenticate(final String userName, final String password) {
        return userRepository.findByUserName(userName)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .isPresent();
    }


    /**
     * 로그인 + JWT 발급
     * 명세:
     * {
     *   accessToken,
     *   refreshToken,
     *   user: { id, user_name, nickname }
     * }
     */
    public TokenResponse login(LoginRequest request) {

        User user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new IllegalArgumentException("이름 또는 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이름 또는 비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtUtil.createAccessToken(user);
        String refreshToken = jwtUtil.createRefreshToken(user);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(TokenResponse.UserDto.builder()
                        .id(user.getId())
                        .userName(user.getUserName())
                        .nickname(user.getNickname())
                        .build())
                .build();
    }


//    /**
//     * /auth/me — 액세스 토큰 기반 본인 정보 조회
//     */
//    public UserMeResponse getMe(User user) {
//        return new UserMeResponse(user.getUserName());
//    }
//

    /**
     * 회원가입
     * 명세:
     * 409(또는 400) — 중복
     * 저장 시 BCrypt 해시
     */
    public void signUp(SignUpRequest request) {

        if (userRepository.existsByUserName(request.getUserName())) {
            throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = User.builder()
                .userName(request.getUserName())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .build();

        userRepository.save(newUser);
    }
    public User getUser(String userName) {
        return userRepository.findByUserName(userName)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}