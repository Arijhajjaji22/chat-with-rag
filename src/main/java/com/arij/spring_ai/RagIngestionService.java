package com.arij.spring_ai;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RagIngestionService {

    private final VectorStore vectorStore;

    @Value("classpath:documents/data.pdf")
    private Resource pdfResource;

    public RagIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @PostConstruct // s'exécute automatiquement au démarrage
    public void indexer() {
        // 1. Lire le PDF
        PagePdfDocumentReader reader = new PagePdfDocumentReader(pdfResource);
        List<Document> docs = reader.get();

        // 2. Découper en petits morceaux
        TokenTextSplitter splitter = new TokenTextSplitter();
        List<Document> chunks = splitter.apply(docs);

        // 3. Stocker dans le VectorStore
        vectorStore.add(chunks);

        System.out.println("✅ PDF indexé : " + chunks.size() + " morceaux");
    }
}