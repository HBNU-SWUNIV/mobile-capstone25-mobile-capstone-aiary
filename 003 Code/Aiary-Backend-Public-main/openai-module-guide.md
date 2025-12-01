# OpenAI 모듈 아키텍처 가이드

OpenAI 통합 모듈의 구조와 각 컴포넌트의 역할 및 활용 방법을 설명합니다.

## 📦 모듈 구조

```
llm/openai/
├── OpenAiClient.java              # LlmClient 인터페이스 구현체
├── OpenAiConfig.java              # OpenAI 클라이언트 Bean 설정
├── OpenAiProperties.java          # 설정 프로퍼티 바인딩
├── PromptManager.java             # 프롬프트 및 메시지 빌더
├── SystemPromptProvider.java      # 시스템 프롬프트 템플릿
├── OpenAiResponseParser.java      # 응답 파싱 및 변환
└── DiaryContent.java              # 일기 데이터 DTO
```

## 🎯 핵심 컴포넌트

### 1. OpenAiClient
**역할**: LlmClient 인터페이스의 OpenAI 구현체

**주요 메서드**:
```java
// 실시간 스트리밍 채팅 응답
void streamReply(List<MessageView> context, StreamCallback cb)

// 일기 생성 (비스트리밍)
String generateDiary(List<MessageView> context)
```

**활용 예시**:
```java
@Service
public class ChatService {
    private final LlmClient openAiLlmClient;

    public void chat(List<LlmClient.MessageView> messages) {
        openAiLlmClient.streamReply(messages, new StreamCallback() {
            @Override
            public void onDelta(String text) {
                // 스트리밍 텍스트 처리
            }

            @Override
            public void onComplete(String fullText) {
                // 완료 처리
            }

            @Override
            public void onError(Throwable t) {
                // 에러 처리
            }
        });
    }
}
```

**의존성**:
- `OpenAIClient`: OpenAI SDK 클라이언트
- `OpenAiProperties`: 모델, temperature 등 설정
- `PromptManager`: 메시지 빌드
- `OpenAiResponseParser`: 응답 파싱

### 2. PromptManager
**역할**: 대화 컨텍스트를 OpenAI API 형식으로 변환

**주요 메서드**:
```java
// 스트리밍 채팅용 메시지 빌드
List<MessageView> buildStreamChatMessages(List<MessageView> context)

// 일기 생성용 메시지 빌드
List<MessageView> buildDiaryGenerationMessages(List<MessageView> context)
```

**활용 시나리오**:

#### 시나리오 1: 실시간 채팅
```java
List<MessageView> userMessages = List.of(
    new MessageView("user", "오늘 기분이 안 좋아요")
);

// 감정 분석 시스템 프롬프트 + 사용자 메시지
List<MessageView> messages = promptManager.buildStreamChatMessages(userMessages);
// -> [system: 감정 분석 전문가..., user: 오늘 기분이 안 좋아요]
```

#### 시나리오 2: 일기 생성
```java
List<MessageView> conversation = List.of(
    new MessageView("user", "오늘 회사에서 발표했어요"),
    new MessageView("assistant", "어떻게 되었나요?"),
    new MessageView("user", "잘 끝냈어요!")
);

// 일기 생성 시스템 프롬프트 + 대화 요약
List<MessageView> messages = promptManager.buildDiaryGenerationMessages(conversation);
// -> [system: 일기 작성 도우미..., user: 다음은 사용자와의 대화입니다...]
```

**의존성**:
- `SystemPromptProvider`: 시스템 프롬프트 제공

### 3. SystemPromptProvider
**역할**: AI의 페르소나와 작업을 정의하는 시스템 프롬프트 관리

**주요 메서드**:
```java
// 감정 분석 및 공감 채팅용 프롬프트
String getEmotionAnalysisPrompt()

// 일기 생성용 프롬프트 (JSON 응답 형식 포함)
String getDiaryGenerationPrompt()
```

**프롬프트 커스터마이징**:
```java
@Component
public class SystemPromptProvider {
    public String getEmotionAnalysisPrompt() {
        return """
            당신은 감정 분석 전문가입니다.
            - 사용자의 감정을 공감하며 대화
            - 부드럽고 따뜻한 톤
            - 구체적인 질문으로 감정 탐색
            """;
    }

    public String getDiaryGenerationPrompt() {
        return """
            대화를 분석하여 1인칭 일기로 작성하세요.

            응답 형식 (JSON):
            {
              "content": "일기 본문",
              "summary": "한 줄 요약"
            }
            """;
    }
}
```

**활용 팁**:
- 프롬프트 변경 시 AI 응답 스타일 즉시 변경 가능
- 도메인별로 다른 프롬프트 추가 가능 (예: `getTherapyPrompt()`, `getMoodTrackingPrompt()`)

### 4. OpenAiResponseParser
**역할**: OpenAI 응답을 애플리케이션 객체로 변환

**주요 메서드**:
```java
// JSON 응답을 DiaryContent로 파싱
DiaryContent parseDiaryContent(String jsonResponse)
```

**파싱 전략**:
1. **JSON 추출**: 응답에서 JSON 부분만 추출
2. **역직렬화**: Jackson으로 DiaryContent 객체 생성
3. **Fallback**: 파싱 실패 시 원본 텍스트로 DiaryContent 생성

**활용 예시**:
```java
String rawResponse = """
{
  "content": "오늘은 정말 특별한 날이었다...",
  "summary": "발표 성공으로 뿌듯한 하루"
}
""";

DiaryContent diary = parser.parseDiaryContent(rawResponse);
// diary.getContent() -> "오늘은 정말 특별한 날이었다..."
// diary.getSummary() -> "발표 성공으로 뿌듯한 하루"
```

**에러 처리**:
```java
// 파싱 실패 시 자동으로 fallback 객체 생성
DiaryContent fallback = new DiaryContent(
    "일기 생성 중 오류가 발생했습니다.",
    rawResponse  // 원본 응답을 summary에 저장
);
```

### 5. OpenAiConfig
**역할**: OpenAI 클라이언트 Bean 생성 및 설정

**Bean 생성 로직**:
```java
@Bean
public OpenAIClient openAIClient() {
    // 1. Properties에서 API 키 확인
    String apiKey = properties.getApiKey();

    // 2. 환경 변수 확인 (fallback)
    if (apiKey == null || apiKey.isEmpty()) {
        apiKey = System.getenv("OPENAI_API_KEY");
    }

    // 3. API 키 없으면 null 반환 (앱은 정상 시작)
    if (apiKey == null || apiKey.isEmpty()) {
        return null;
    }

    // 4. OpenAI 클라이언트 생성
    return OpenAIOkHttpClient.builder()
            .apiKey(apiKey)
            .build();
}
```

**Graceful Degradation**:
- API 키가 없어도 애플리케이션 시작 가능
- `OpenAiClient`는 `@Autowired(required = false)`로 주입
- 실제 호출 시 `ensureApiKeyConfigured()`에서 예외 발생

### 6. OpenAiProperties
**역할**: application.properties의 OpenAI 설정 바인딩

**설정 항목**:
```properties
# API 인증
openai.api.key=${OPENAI_API_KEY:default-key}

# 모델 선택
openai.model=gpt-4-turbo-preview
# 옵션: gpt-4o-mini, gpt-3.5-turbo

# 응답 다양성 (0.0 ~ 2.0)
openai.temperature=0.7
# 낮을수록 일관적, 높을수록 창의적

# 최대 토큰 수
openai.max-tokens=1000
```

**활용 시나리오**:

#### 개발 환경
```properties
openai.model=gpt-3.5-turbo     # 빠르고 저렴
openai.temperature=0.7
openai.max-tokens=500
```

#### 프로덕션 환경
```properties
openai.model=gpt-4-turbo-preview  # 고품질
openai.temperature=0.7
openai.max-tokens=1000
```

#### 창의적 일기 작성
```properties
openai.temperature=1.2  # 더 창의적인 표현
openai.max-tokens=1500  # 긴 일기
```

### 7. DiaryContent
**역할**: 일기 데이터 전송 객체

**구조**:
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaryContent {
    private String content;  // 일기 본문 (독백형 1인칭)
    private String summary;  // 한 줄 요약
}
```

**사용 예시**:
```java
// OpenAI 응답 -> DiaryContent
DiaryContent diary = responseParser.parseDiaryContent(rawResponse);

// 포맷팅하여 클라이언트에 전달
String formattedDiary = String.format(
    "【요약】\n%s\n\n【일기】\n%s",
    diary.getSummary(),
    diary.getContent()
);

// DB 저장 시 분리 저장 가능
diaryEntity.setContent(diary.getContent());
diaryEntity.setSummary(diary.getSummary());
```

## 🔄 데이터 흐름

### 스트리밍 채팅 플로우
```
사용자 메시지
    ↓
PromptManager.buildStreamChatMessages()
    ↓ [system: 감정 분석..., user: ...]
OpenAiClient.streamReply()
    ↓ OpenAI API 호출
StreamCallback.onDelta() (여러 번)
    ↓ 텍스트 조각들
StreamCallback.onComplete()
    ↓
최종 응답 완료
```

### 일기 생성 플로우
```
대화 히스토리
    ↓
PromptManager.buildDiaryGenerationMessages()
    ↓ [system: 일기 작성..., user: 대화 요약]
OpenAiClient.generateDiary()
    ↓ OpenAI API 호출
OpenAiResponseParser.parseDiaryContent()
    ↓ JSON 파싱
DiaryContent
    ↓
포맷팅된 일기 문자열
```

## 🔌 통합 예시

### 1. 기존 DiaryService와 통합
```java
@Service
@RequiredArgsConstructor
public class DiaryService {
    private final LlmClient openAiLlmClient;  // Bean 이름으로 주입
    private final DiaryRepository repository;

    public Diary createDiary(List<ChatMessage> chatHistory) {
        // 1. ChatMessage -> MessageView 변환
        List<LlmClient.MessageView> context = chatHistory.stream()
            .map(msg -> new LlmClient.MessageView(
                msg.getRole(),
                msg.getContent()
            ))
            .toList();

        // 2. OpenAI로 일기 생성
        String diaryText = openAiLlmClient.generateDiary(context);

        // 3. DB 저장
        Diary diary = new Diary();
        diary.setContent(diaryText);
        return repository.save(diary);
    }
}
```

### 2. SSE 스트리밍 컨트롤러
```java
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final LlmClient openAiLlmClient;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestParam String message) {
        SseEmitter emitter = new SseEmitter();

        List<LlmClient.MessageView> context = List.of(
            new LlmClient.MessageView("user", message)
        );

        CompletableFuture.runAsync(() -> {
            openAiLlmClient.streamReply(context, new StreamCallback() {
                @Override
                public void onDelta(String text) {
                    try {
                        emitter.send(SseEmitter.event()
                            .name("message")
                            .data(text));
                    } catch (IOException e) {
                        emitter.completeWithError(e);
                    }
                }

                @Override
                public void onComplete(String full) {
                    emitter.complete();
                }

                @Override
                public void onError(Throwable t) {
                    emitter.completeWithError(t);
                }
            });
        });

        return emitter;
    }
}
```

### 3. 커스텀 프롬프트 추가
```java
@Component
public class SystemPromptProvider {

    // 기존 메서드들...

    // 새로운 기능: 감정 일지 작성
    public String getMoodJournalPrompt() {
        return """
            당신은 감정 코칭 전문가입니다.

            사용자의 대화에서 감정 패턴을 분석하고,
            감정 인식, 수용, 조절 방법을 제안하는
            감정 일지를 작성하세요.

            응답 형식 (JSON):
            {
              "emotions": ["기쁨", "불안", "희망"],
              "analysis": "감정 분석 내용",
              "suggestion": "감정 조절 제안"
            }
            """;
    }
}
```

```java
// PromptManager에 새 메서드 추가
public List<MessageView> buildMoodJournalMessages(List<MessageView> context) {
    List<MessageView> messages = new ArrayList<>();
    messages.add(new MessageView("system", promptProvider.getMoodJournalPrompt()));
    messages.add(new MessageView("user", buildConversationSummary(context)));
    return messages;
}
```

## ⚙️ 설정 및 환경

### 환경 변수 우선순위
1. **환경 변수**: `export OPENAI_API_KEY="sk-..."`
2. **application.properties**: `openai.api.key=sk-...`

### 추천 설정

#### 로컬 개발
```bash
# .env 파일 또는 IDE 환경 변수
export OPENAI_API_KEY="sk-proj-..."
```

#### 프로덕션 (Docker)
```yaml
# docker-compose.yml
services:
  app:
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
```

#### 프로덕션 (Kubernetes)
```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: openai-secret
type: Opaque
data:
  api-key: <base64-encoded-key>
```

## 🛡️ 에러 처리

### API 키 미설정
```java
try {
    openAiLlmClient.streamReply(context, callback);
} catch (IllegalStateException e) {
    // "OpenAI API key is not configured"
    log.error("API 키가 설정되지 않았습니다", e);
    return "일시적으로 서비스를 사용할 수 없습니다";
}
```

### 네트워크 오류
```java
@Override
public void onError(Throwable t) {
    if (t instanceof IOException) {
        log.error("네트워크 오류", t);
    } else if (t instanceof TimeoutException) {
        log.error("타임아웃", t);
    }
    // 사용자에게 재시도 요청
}
```

### 파싱 오류
```java
// OpenAiResponseParser가 자동으로 fallback 처리
// 파싱 실패 시 원본 텍스트를 content에 저장
DiaryContent diary = parser.parseDiaryContent(response);
if (diary.getSummary().contains("파싱 오류")) {
    log.warn("일기 파싱 실패, fallback 사용");
}
```

## 📊 모니터링 포인트

### 성능 메트릭
- OpenAI API 호출 시간
- 스트리밍 응답 완료 시간
- 토큰 사용량

### 에러 메트릭
- API 키 오류 빈도
- 네트워크 타임아웃 빈도
- 파싱 실패율

### 비용 최적화
```java
// 모델 선택으로 비용 절감
openai.model=gpt-3.5-turbo  // gpt-4 대비 1/10 비용

// 토큰 제한으로 비용 제어
openai.max-tokens=500  // 응답 길이 제한
```

## 🔐 보안 고려사항

1. **API 키 관리**
   - 절대 코드에 하드코딩 금지
   - 환경 변수 또는 Secret 관리 시스템 사용
   - Git에 커밋 금지 (.gitignore에 추가)

2. **사용자 입력 검증**
   ```java
   if (message.length() > 10000) {
       throw new IllegalArgumentException("메시지가 너무 깁니다");
   }
   ```

3. **Rate Limiting**
   ```java
   @RateLimiter(name = "openai", fallbackMethod = "fallback")
   public String generateDiary(List<MessageView> context) {
       // ...
   }
   ```

## 📝 테스트

### 단위 테스트
```java
@Test
void testPromptManager() {
    List<MessageView> context = List.of(
        new MessageView("user", "테스트")
    );

    List<MessageView> messages = promptManager.buildStreamChatMessages(context);

    assertThat(messages).hasSize(2);
    assertThat(messages.get(0).role()).isEqualTo("system");
    assertThat(messages.get(1).content()).isEqualTo("테스트");
}
```

### 통합 테스트
```java
@Test
@Disabled("실제 API 키 필요")
void testOpenAiIntegration() {
    String diary = openAiLlmClient.generateDiary(context);
    assertThat(diary).contains("요약", "일기");
}
```

### 수동 테스트
```bash
# Health check
curl http://localhost:8080/api/openai-test/health

# 일기 생성
curl -X POST http://localhost:8080/api/openai-test/diary \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"테스트"}]}'
```

## 🎓 추가 학습 자료

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Spring Boot Configuration Properties](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
