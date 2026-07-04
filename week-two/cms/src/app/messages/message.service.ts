import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/messages';
  messages: Message[] = [];
  maxMessageId = 0;
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {}

  getMessages(): Message[] {
    this.http.get<{ message: string; messages: Message[] }>(this.apiUrl).subscribe({
      next: (responseData) => {
        this.messages = responseData.messages ?? [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      error: (error) => console.error(error)
    });

    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; newMessage: Message }>(this.apiUrl, message, { headers })
      .subscribe({
        next: (responseData) => {
          this.messages.push(responseData.newMessage);
          this.messageChangedEvent.emit(this.messages.slice());
        },
        error: (error) => console.error(error)
      });
  }
}
