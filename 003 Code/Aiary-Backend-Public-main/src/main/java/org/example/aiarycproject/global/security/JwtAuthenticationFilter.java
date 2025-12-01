package org.example.aiarycproject.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.user.entity.User;
import org.example.aiarycproject.domain.user.repository.UserRepository;
import org.example.aiarycproject.global.jwt.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1) OPTIONS 요청은 무조건 통과 (CORS Preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2) 인증이 필요 없는 URL은 JWT 검사 스킵
        String path = request.getRequestURI();
        if (path.startsWith("/auth/login") || path.startsWith("/auth/sign-up")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3) Authorization 헤더 확인
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        // 4) Token 유효성 검증
        if (!jwtUtil.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 5) 토큰에서 userName 추출
        String userName = jwtUtil.getUsernameFromToken(token);

        // 6) DB 유저 조회
        User user = userRepository.findByUserName(userName)
                .orElse(null);

        if (user != null) {
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, null);

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 7) 다음 필터로 전달
        filterChain.doFilter(request, response);
    }
}
