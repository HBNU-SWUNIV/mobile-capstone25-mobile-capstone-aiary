# 1. Gradle 빌드 이미지
FROM gradle:8.7-jdk21 AS build
WORKDIR /app

# 프로젝트 전체 복사
COPY . .

RUN chmod +x gradlew
# 테스트 생략하고 빌드
RUN ./gradlew clean build -x test

# 2. 실제 실행용 이미지
FROM eclipse-temurin:21-jdk
WORKDIR /app

# build/libs/*.jar 복사
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# 환경변수(OpenAI Key, DB 정보 등)는 Render Dashboard에서 설정함
ENTRYPOINT ["java", "-jar", "/app/app.jar"]