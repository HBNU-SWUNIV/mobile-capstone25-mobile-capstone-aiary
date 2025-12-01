
# Aiary Backend (Aiary-Cproject-Render)

[![License: Educational](https://img.shields.io/badge/License-Educational-blue.svg)](https://github.com/Capstone-Aiary/Aiary-Cproject-Render/blob/main/LICENSE)
[![Built with Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Language: Java](https://img.shields.io/badge/Language-Java_21-orange?logo=openjdk&logoColor=white)](https://www.java.com/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Deployment: Render](https://img.shields.io/badge/Deployment-Render-0072aa?logo=render&logoColor=white)](https://render.com/)

AI 기반 대화형 일기 서비스 **Aiary**의 백엔드 레포지토리입니다.  
사용자의 대화를 기반으로 GPT 모델이 스트리밍 응답을 생성하며,  
일기 저장·요약·감정 분석까지 자동으로 처리합니다.

---

## ⚙️ Tech Stack

| 분류 | 기술 |
|:------|:------|
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.5.5 |
| **Build Tool** | Gradle, Spring Dependency Management |
| **Web** | Spring Boot Web |
| **Database** | PostgreSQL 42.7.4 |
| **ORM** | Spring Data JPA, Hibernate |
| **JSONB 지원** | hibernate-types-60 (2.21.1) |
| **Security** | Spring Security, JWT (jjwt 0.11.5) |
| **AI Integration** | OpenAI Java SDK (4.0.0) |
| **API Docs** | SpringDoc OpenAPI / Swagger UI |
| **Testing** | JUnit 5 |
| **Utilities** | Lombok |
| **Deployment** | Render.com |

---

## ✨ Features

### 🔐 Authentication
* 회원가입 / 로그인
* JWT 기반 Access/Refresh Token
* Token 재발급

### 💬 Chat (Threads & Messages)
* 스레드 생성
* 사용자 메시지 입력
* OpenAI API 호출 → **SSE 기반 스트리밍 응답**
* 프론트는 턴 단위 EventSource 생성 구조

### 📘 Diary System
* 대화 기반 일기 자동 생성
* 요약(`summary`)
* 감정 저장(`JSONB`)
* 주요 감정(`dominant_emotion`)
* 감정 점수(`overall_mood_score`)
* 추천 메시지(`recommendation`)

### 😊 Emotion Report API
* `GET /diaries/{diaryId}/emotion`
* 해당 일기의 감정 분석 상세 조회

---

## 📁 Project Structure

```

src/main/java/org/example/aiarycproject
│── global
│   ├── config
│   ├── jwt
│   └── security
│── domain
│   ├── user
│   ├── chat
│   │   ├── message
│   │   └── thread
│   ├── diary
│   └── emotion
└── …

```

---

## 📄 API Documentation

**Swagger UI:** [https://aiary-cproject-render-backend.onrender.com/swagger-ui/index.html](https://aiary-cproject-render-backend.onrender.com/swagger-ui/index.html)

---

## 🔧 Environment Variables

프로젝트 실행을 위해 다음 환경 변수 설정이 필요합니다.

```

OPENAI\_API\_KEY=
DB\_URL=
DB\_USERNAME=
DB\_PASSWORD=

JWT\_SECRET=
JWT\_ACCESS\_EXPIRATION=
JWT\_REFRESH\_EXPIRATION=

````

---

## ▶️ Local Development

### 1) Clone
```bash
git clone [https://github.com/Capstone-Aiary/Aiary-Cproject-Render.git](https://github.com/Capstone-Aiary/Aiary-Cproject-Render.git)
````

### 2\) Build

```bash
./gradlew build
```

### 3\) Run

```bash
java -jar build/libs/*.jar
```

-----

## 🚀 Deployment (Render)

  * Spring Boot 자동 포트 감지
  * PostgreSQL 10GB
  * Env Vars / Build Command / Health Check 설정 사용

-----

## Contributors

  * 이선혜 — Backend

-----

## License

This project is created for educational purposes (Capstone Design).
