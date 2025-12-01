# OpenAI 테스트 API 가이드

OpenAI 통합을 테스트할 수 있는 간단한 REST API 컨트롤러입니다.

## 사전 준비

1. OpenAI API 키 설정 (둘 중 하나)
   ```bash
   # 방법 1: 환경 변수
   export OPENAI_API_KEY="your-api-key"

   # 방법 2: application.properties 수정
   # src/main/resources/application.properties의 openai.api.key 값 변경
   ```

2. 애플리케이션 실행
   ```bash
   ./gradlew bootRun
   ```

## API 엔드포인트

### 1. 건강 체크 (Health Check)

OpenAI 클라이언트가 정상적으로 설정되었는지 확인합니다.

```bash
curl http://localhost:8080/api/openai-test/health
```

**응답 예시:**
```json
{
  "status": "ok",
  "openAiConfigured": true,
  "message": "OpenAI 클라이언트가 정상적으로 설정되었습니다."
}
```

### 2. 일기 생성 테스트

대화 컨텍스트를 기반으로 일기를 생성합니다.

```bash
curl -X POST http://localhost:8080/api/openai-test/diary \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "오늘 회사에서 프로젝트 발표가 있었어요."
      },
      {
        "role": "assistant",
        "content": "발표는 어떻게 진행되었나요?"
      },
      {
        "role": "user",
        "content": "떨렸지만 잘 끝냈어요. 팀장님도 칭찬해주셨어요."
      }
    ]
  }'
```

**응답 예시:**
```json
{
  "success": true,
  "diary": "【요약】\n프로젝트 발표를 성공적으로 마치고 칭찬을 받았다.\n\n【일기】\n오늘은 회사에서 큰 프로젝트 발표가 있었다. 발표 전에는 많이 떨렸지만, 준비한 내용을 차근차근 설명하며 어느덧 발표를 잘 마칠 수 있었다. 특히 팀장님께서 칭찬해주셔서 더욱 뿌듯했다. 긴장했던 만큼 보람도 컸던 하루였다."
}
```

### 3. 스트리밍 채팅 테스트 (SSE)

실시간 스트리밍 응답을 테스트합니다.

```bash
curl -N http://localhost:8080/api/openai-test/stream?message=오늘%20기분이%20좋지%20않아요
```

**응답 예시:**
```
event: delta
data: 그렇군요

event: delta
data: .

event: delta
data:  무슨

event: delta
data:  일이

event: delta
data:  있었나요

event: delta
data: ?

event: done
data: {"fullText":"그렇군요. 무슨 일이 있었나요?","length":20}
```

## 브라우저에서 테스트

### Health Check
브라우저에서 직접 열기:
```
http://localhost:8080/api/openai-test/health
```

### SSE 스트리밍 (브라우저 콘솔에서)
```javascript
const eventSource = new EventSource('http://localhost:8080/api/openai-test/stream?message=안녕하세요');

eventSource.addEventListener('delta', (event) => {
  console.log('Delta:', event.data);
});

eventSource.addEventListener('done', (event) => {
  console.log('Done:', event.data);
  eventSource.close();
});

eventSource.addEventListener('error', (event) => {
  console.error('Error:', event.data);
  eventSource.close();
});
```

## 문제 해결

### 1. "OpenAI 클라이언트가 설정되지 않았습니다"
- `OPENAI_API_KEY` 환경 변수가 설정되었는지 확인
- 또는 `src/main/resources/application.properties`의 `openai.api.key` 값 확인

### 2. "401 Unauthorized" 또는 API 키 관련 오류
- OpenAI API 키가 유효한지 확인
- 계정에 충분한 크레딧이 있는지 확인

### 3. 응답이 너무 느림
- `application.properties`의 `openai.model`을 더 빠른 모델로 변경 (예: `gpt-3.5-turbo`)
- `openai.max-tokens` 값을 줄여서 응답 길이 제한

## 참고

- 실제 OpenAI API를 호출하므로 비용이 발생할 수 있습니다.
- 개발/테스트 환경에서만 사용하세요.
- 프로덕션 환경에서는 기존 도메인 API (`/chat/`, `/diaries/`)를 사용하세요.
