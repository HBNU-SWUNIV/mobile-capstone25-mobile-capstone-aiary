package org.example.aiarycproject.llm.openai;

import com.openai.client.OpenAIClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import lombok.RequiredArgsConstructor;
import org.example.aiarycproject.llm.LlmClient;
import org.example.aiarycproject.llm.StreamCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;

@Primary
@Component("openAiLlmClient")
public class OpenAiClient implements LlmClient {

    private final OpenAIClient openAIClient;
    private final OpenAiProperties properties;
    private final PromptManager promptManager;
    private final OpenAiResponseParser responseParser;

    public OpenAiClient(@Autowired(required = false) OpenAIClient openAIClient,
                        OpenAiProperties properties,
                        PromptManager promptManager,
                        OpenAiResponseParser responseParser) {
        this.openAIClient = openAIClient;
        this.properties = properties;
        this.promptManager = promptManager;
        this.responseParser = responseParser;
    }

    private void ensureApiKeyConfigured() {
        if (openAIClient == null) {
            throw new IllegalStateException("OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.");
        }
    }

    @Override
    public void streamReply(List<MessageView> context, StreamCallback cb) {
        ensureApiKeyConfigured();
        try {
            List<MessageView> messages = promptManager.buildStreamChatMessages(context);

            ChatCompletionCreateParams.Builder paramsBuilder = ChatCompletionCreateParams.builder()
                    .model(properties.getModel());

            for (MessageView msg : messages) {
                switch (msg.role()) {
                    case "system" -> paramsBuilder.addSystemMessage(msg.content());
                    case "user" -> paramsBuilder.addUserMessage(msg.content());
                    case "assistant" -> paramsBuilder.addAssistantMessage(msg.content());
                }
            }

            ChatCompletionCreateParams createParams = paramsBuilder.build();

            StringBuilder fullResponse = new StringBuilder();

            openAIClient.chat().completions().createStreaming(createParams)
                    .stream()
                    .forEach(chunk -> {
                        String delta = chunk.choices().stream()
                                .filter(choice -> choice.delta().content().isPresent())
                                .map(choice -> choice.delta().content().get())
                                .findFirst()
                                .orElse("");

                        if (!delta.isEmpty()) {
                            fullResponse.append(delta);
                            cb.onDelta(delta);
                        }
                    });

            cb.onComplete(fullResponse.toString());

        } catch (Exception e) {
            cb.onError(e);
        }
    }

    @Override
    public String generateDiary(List<MessageView> context) {
        ensureApiKeyConfigured();
        try {
            List<MessageView> messages = promptManager.buildDiaryGenerationMessages(context);

            ChatCompletionCreateParams.Builder paramsBuilder = ChatCompletionCreateParams.builder()
                    .model(properties.getModel());

            for (MessageView msg : messages) {
                switch (msg.role()) {
                    case "system" -> paramsBuilder.addSystemMessage(msg.content());
                    case "user" -> paramsBuilder.addUserMessage(msg.content());
                    case "assistant" -> paramsBuilder.addAssistantMessage(msg.content());
                }
            }

            ChatCompletionCreateParams createParams = paramsBuilder.build();

            ChatCompletion completion = openAIClient.chat().completions().create(createParams);

            String rawResponse = completion.choices().stream()
                    .findFirst()
                    .flatMap(choice -> choice.message().content())
                    .orElseThrow(() -> new RuntimeException("No response from OpenAI"));

            return rawResponse;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate diary: " + e.getMessage(), e);
        }
    }
}
