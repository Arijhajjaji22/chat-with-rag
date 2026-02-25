import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  messages: Message[] = [];
  question: string = '';
  isLoading: boolean = false;
  useRag: boolean = false;
  private chatSubscription: any;
  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.question.trim()) return;

    // Ajoute le message user
    this.messages.push({
      role: 'user',
      content: this.question,
      timestamp: new Date()
    });

    const q = this.question;
    this.question = '';
    this.isLoading = true;

    // Appelle le bon endpoint
    const call$ = this.useRag 
      ? this.chatService.chatRag(q) 
      : this.chatService.chat(q);

    call$.subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messages.push({
          role: 'assistant',
          content: 'Erreur : impossible de contacter le serveur.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  clearHistory() {
    this.messages = [];
  }
parseMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  // Gras **
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // Italique *
  html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');

  // Liens [text](url)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Listes simples
  html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '<li>$1</li>');
  if (html.includes('<li>')) {
    html = '<ul>' + html + '</ul>';
  }

  // Retours à la ligne
  html = html.replace(/\n/g, '<br>');

  return html;
}
  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  stopChat() {
  this.isLoading = false;

  // Si tu utilises un Observable, tu peux aussi annuler l'abonnement
  if (this.chatSubscription) {
    this.chatSubscription.unsubscribe();
  }

  // Optionnel : ajoute un message pour indiquer l'arrêt
  this.messages.push({
    role: 'assistant',
    content: 'Chat stopped .',
    timestamp: new Date()
  });
}

}