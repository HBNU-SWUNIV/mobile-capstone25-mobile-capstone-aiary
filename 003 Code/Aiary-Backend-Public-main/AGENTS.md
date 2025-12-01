# Repository Guidelines

## Project Structure & Module Organization
- Java 21 + Spring Boot (Gradle).
- Source: `src/main/java/org/example/aiarycproject` organized by feature domain:
  - `domain/<feature>/{entity,repository,service,web}` (e.g., `messages`, `threads`, `diaries`).
  - `llm/` contains `LlmClient` and `DummyLlmClient` stubs.
  - `config/` contains cross‑cutting config (e.g., `CorsConfig`).
- Resources: `src/main/resources`
  - `application.properties` (DB, JPA, etc.).
  - `db/migration` for SQL migrations (`V{N}__desc.sql`).
- Tests: `src/test/java`.
- Local DB: `docker-compose.yml` (Postgres on `localhost:5444`).

## Build, Test, and Development Commands
- Run DB: `docker-compose up -d db` (first time: pulls Postgres).
- Run app: `./gradlew bootRun` (uses `application.properties`).
- Tests: `./gradlew test` (JUnit 5, Spring Boot Test).
- Build jar: `./gradlew build`; run: `java -jar build/libs/Aiary-Cproject-*.jar`.
- Override DB via env: `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5444/aiary SPRING_DATASOURCE_USERNAME=aiary SPRING_DATASOURCE_PASSWORD=... ./gradlew bootRun`.

## Coding Style & Naming Conventions
- Indentation: 4 spaces; braces on same line; one class per file.
- Packages follow `org.example.aiarycproject.domain.<feature>`; keep layers `{entity,repository,service,web}`.
- Class names: PascalCase; methods/fields: lowerCamelCase.
- Suffixes: `*Controller`, `*Service`, `*Repository`.
- Use Lombok (`@RequiredArgsConstructor`, `@Getter/@Setter`); prefer constructor injection.
- Keep controller DTOs small; map errors with appropriate HTTP codes (see existing controllers).

## Testing Guidelines
- Frameworks: JUnit 5 + Spring Boot Test.
- Naming: `*Tests.java`; test public API and service happy-paths; add edge/error cases.
- DB tests: ensure Postgres is running (`docker-compose up -d db`). H2 is optional and currently commented; prefer Postgres for integration.
- Run: `./gradlew test`.

## Commit & Pull Request Guidelines
- Commits: start with type and short summary; link issues, e.g. `feat: SSE chat API (resolves #1)`.
- PRs must include: problem & approach, linked issues, API changes (paths/payloads), manual test notes (e.g., `curl`), and migration notes if touching `db/migration`.

## Security & Configuration Tips
- Never commit real credentials; prefer env overrides for secrets.
- Restrict CORS in production by tightening `CorsConfig` origins/methods.
- For schema changes, add a new migration file (`db/migration/V{next}__meaningful_name.sql`) and update repositories accordingly.

## Agent-Specific Instructions
- Do not rename public endpoints without coordination; preserve SSE behavior in `/chat/stream`.
- Keep feature boundaries (`messages`, `threads`, `diaries`) intact; place new code in the correct layer.
- If adding LLM providers, implement `LlmClient` and wire via Spring.
