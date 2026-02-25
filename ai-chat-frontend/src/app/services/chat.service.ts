import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:9095/gemini';

  constructor(private http: HttpClient) {}

  chat(message: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post(`${this.apiUrl}/chat`, message, 
      { headers, responseType: 'text' });
  }

  chatRag(message: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post(`${this.apiUrl}/rag`, message, 
      { headers, responseType: 'text' });
  }
}