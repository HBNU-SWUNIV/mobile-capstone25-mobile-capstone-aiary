package org.example.aiarycproject.llm.openai;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class OpenAiConfig {

    private final OpenAiProperties properties;

    @Bean
    public OpenAIClient openAIClient() {
        String apiKey = properties.getApiKey();
        System.out.println("DEBUG: OpenAI API Key from properties: " + (apiKey != null ? apiKey.substring(0, Math.min(20, apiKey.length())) + "..." : "null"));

        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("OPENAI_API_KEY");
            System.out.println("DEBUG: OpenAI API Key from env: " + (apiKey != null ? apiKey.substring(0, Math.min(20, apiKey.length())) + "..." : "null"));
        }

        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("DEBUG: No OpenAI API key found, returning null");
            return null;
        }

        System.out.println("DEBUG: Creating OpenAI client with key");
        return OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .build();
    }
}
