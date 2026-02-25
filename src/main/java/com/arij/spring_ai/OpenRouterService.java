package com.arij.spring_ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

@Service
public class OpenRouterService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public OpenRouterService(ChatClient.Builder builder, VectorStore vectorStore) {
        this.chatClient = builder.build();
        this.vectorStore = vectorStore;
    }

    // chat normal sans RAG
    public String chat(String message) {
        return chatClient.prompt()
                .user(message)
                .call()
                .content();
    }

    // chat avec RAG — cherche dans le PDF avant de répondre
    public String chatAvecRag(String message) {
        return chatClient.prompt()
                .advisors(new QuestionAnswerAdvisor(vectorStore)) // ← RAG ici
                .user(message)
                .call()
                .content();
    }
}