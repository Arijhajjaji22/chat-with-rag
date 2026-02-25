package com.arij.spring_ai;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gemini")
public class OpenRouterController {

    private final OpenRouterService service;

    public OpenRouterController(OpenRouterService service) {
        this.service = service;
    }

    @PostMapping("/chat")
    public String chat(@RequestBody String question) {
        return service.chat(question);
    }

    @PostMapping("/rag")
    public String chatRag(@RequestBody String question) {
        return service.chatAvecRag(question);
    }
}