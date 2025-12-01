//package org.example.aiarycproject.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.*;
//
//
//// 안 씀. SecurityConfig랑 중복임.
//// 인증 서비스 전에 구현한 거
////@Configuration
////public class CorsConfig {
////    @Bean
////    public WebMvcConfigurer corsConfigurer() {
////        return new WebMvcConfigurer() {
////            @Override public void addCorsMappings(CorsRegistry registry) {
////                registry.addMapping("/**")
////                        .allowedOrigins("http://localhost:3000")
////                        .allowedMethods("GET","POST","PATCH","DELETE","OPTIONS")
////                        .allowedHeaders("*")
////                        .allowCredentials(true);
////            }
////        };
////    }
////}
//
////@Configuration
////public class CorsConfig {
////
////    @Bean
////    public WebMvcConfigurer corsConfigurer() {
////        return new WebMvcConfigurer() {
////            @Override
////            public void addCorsMappings(CorsRegistry registry) {
////                registry.addMapping("/**")
////                        .allowedOrigins("*")        // 모든 출처 허용
////                        .allowedMethods("*")        // 모든 HTTP 메서드 허용
////                        .allowedHeaders("*")        // 모든 헤더 허용
////                        .allowCredentials(false);   // *와 동시에 true는 불가능
////            }
////        };
////    }
////}
//
//@Configuration
//public class CorsConfig {
//
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins(
//                                "https://aiary-front.vercel.app",
//                                "http://localhost:3000"
//                        )
//                        .allowedMethods("*")
//                        .allowedHeaders("*")
//                        .allowCredentials(true);
//            }
//        };
//    }
//}