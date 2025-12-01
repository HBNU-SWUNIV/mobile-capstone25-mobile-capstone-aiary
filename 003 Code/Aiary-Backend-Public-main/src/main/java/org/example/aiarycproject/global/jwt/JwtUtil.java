package org.example.aiarycproject.global.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.domain.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Access Token
     */
    public String createAccessToken(User user) {
        return createToken(user.getUserName(), accessTokenExpiration);
    }

    /**
     * Refresh Token
     */
    public String createRefreshToken(User user) {
        return createToken(user.getUserName(), refreshTokenExpiration);
    }

    /**
     * JWT 생성
     */
    private String createToken(String userName, long expirationMillis) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(userName)      // user_name 값 저장
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * JWT 유효성 검사
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;

        } catch (ExpiredJwtException e) {
            System.out.println("JWT 만료");
        } catch (JwtException e) {
            System.out.println("JWT 유효하지 않음");
        }

        return false;
    }

    /**
     * 토큰에서 user_name(subject) 추출
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}