# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요
Aiary-Cproject는 SSE 기반 챗봇 백엔드 API를 제공하는 Spring Boot 애플리케이션입니다.
- Java 21 + Spring Boot 3.5.5 + Gradle
- PostgreSQL 데이터베이스 (로컬 Docker 환경)
- JPA/Hibernate ORM
- SSE(Server-Sent Events)를 통한 스트리밍 응답

## 주요 명령어

### 데이터베이스 실행
```bash
docker-compose up -d db
```
첫 실행 시 PostgreSQL 이미지를 pull하며, localhost:5444 포트로 접근 가능

### 애플리케이션 실행
```bash
./gradlew bootRun
```

### 환경 변수로 데이터베이스 설정 오버라이드
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5444/aiary \
SPRING_DATASOURCE_USERNAME=aiary \
SPRING_DATASOURCE_PASSWORD=tjsgprjstkd \
./gradlew bootRun
```

### 테스트 실행
```bash
./gradlew test
```
JUnit 5 + Spring Boot Test 사용. 테스트 실행 전 Docker DB가 실행 중이어야 함.

### 빌드
```bash
./gradlew build
java -jar build/libs/Aiary-Cproject-*.jar
```

## 아키텍처 및 코드 구조

### 패키지 구조
```
src/main/java/org/example/aiarycproject/
├── config/              # CORS 등 전역 설정
├── domain/              # 도메인 기능별 조직
│   ├── diaries/         # 일기 도메인
│   ├── messages/        # 채팅 메시지 도메인
│   └── threads/         # 채팅 스레드 도메인
│       ├── entity/      # JPA 엔티티
│       ├── repository/  # Spring Data JPA 리포지토리
│       ├── service/     # 비즈니스 로직
│       └── web/         # REST 컨트롤러
└── llm/                 # LLM 클라이언트 인터페이스 및 구현체
```

### 도메인 레이어 패턴
각 도메인(`messages`, `threads`, `diaries`)은 4계층 구조를 따릅니다:
- **entity**: JPA 엔티티 클래스 (테이블 매핑)
- **repository**: Spring Data JPA 리포지토리 인터페이스
- **service**: 비즈니스 로직 및 트랜잭션 관리
- **web**: REST API 컨트롤러 (요청/응답 처리)

새로운 기능을 추가할 때는 해당 도메인 하위에 이 4계층 구조를 유지하세요.

### LLM 클라이언트 아키텍처
- `llm/LlmClient` 인터페이스: LLM 제공자 추상화
  - `streamReply()`: SSE 스트리밍 응답
  - `generateDiary()`: 일기 생성
- `llm/DummyLlmClient`: 개발용 더미 구현체
- 실제 LLM 제공자(OpenAI 등)를 추가할 때는 `LlmClient` 인터페이스를 구현하고 Spring Bean으로 등록

### SSE 스트리밍 아키텍처
`/chat/stream` 엔드포인트는 다음 패턴을 따릅니다:
1. 사전 검증: 스레드 상태 확인 (finalized 체크)
2. `SseEmitter` 생성 및 반환
3. `CompletableFuture.runAsync()`로 비동기 스트리밍
4. `StreamCallback` 인터페이스를 통해 델타, 완료, 에러 처리
5. 완료 시 assistant 메시지 저장

이 패턴을 수정할 때는 기존 SSE 동작을 유지하세요.

### 데이터베이스 마이그레이션
- 위치: `src/main/resources/db/migration/`
- 네이밍: `V{번호}__설명.sql` (예: `V2__aiary_chat_diary.sql`)
- 스키마 변경 시 새로운 마이그레이션 파일 추가 후 리포지토리/엔티티 업데이트

## 코딩 스타일

### 네이밍 규칙
- 클래스: PascalCase
- 메서드/필드: lowerCamelCase
- 컨트롤러 접미사: `*Controller`
- 서비스 접미사: `*Service`
- 리포지토리 접미사: `*Repository`

### 코드 스타일
- 들여쓰기: 4 spaces
- 중괄호: 같은 줄에 작성
- 파일당 하나의 클래스
- Lombok 활용: `@RequiredArgsConstructor`, `@Getter/@Setter`
- 생성자 주입 방식 선호

### DTO 및 에러 처리
- 컨트롤러 DTO는 간결하게 유지
- HTTP 상태 코드 매핑:
  - `IllegalStateException` → 409 Conflict
  - `NoSuchElementException` → 404 Not Found
  - `IllegalArgumentException` → 400 Bad Request

## 중요 규칙

### API 엔드포인트
- 공개 엔드포인트 변경 시 협의 필요
- `/chat/stream`의 SSE 동작 유지 필수

### 기능 경계
- 도메인 경계(`messages`, `threads`, `diaries`) 유지
- 새 코드는 올바른 도메인 및 레이어에 배치

### 보안 및 설정
- 실제 자격 증명은 커밋 금지
- 프로덕션 환경에서는 `CorsConfig`의 origin/method 제한 강화
- Spring Security는 현재 주석 처리됨 (추후 추가 예정)

### 커밋 메시지
- 형식: `type: 요약 (resolves #이슈번호)`
- 예: `feat: SSE chat API (resolves #1)`

### PR 체크리스트
- 문제 및 접근 방법 설명
- 관련 이슈 링크
- API 변경 사항 (경로/페이로드)
- 수동 테스트 노트 (예: curl 명령어)
- 마이그레이션 파일 변경 시 설명 추가
