package org.example.aiarycproject.llm.openai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "openai")
public class OpenAiProperties {
    private String apiKey;
    private String model = "gpt-4o-mini";
    private double temperature = 0.7;
    private int maxTokens = 1000;
}
