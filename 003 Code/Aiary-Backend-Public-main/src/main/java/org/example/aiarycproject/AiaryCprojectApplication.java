package org.example.aiarycproject;

import org.example.aiarycproject.llm.openai.OpenAiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(OpenAiProperties.class)
public class AiaryCprojectApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiaryCprojectApplication.class, args);
    }

}
