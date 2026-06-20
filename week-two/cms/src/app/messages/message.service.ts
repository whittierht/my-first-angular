import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private firebaseUrl =
    'https://cms-assignment-11626-default-rtdb.firebaseio.com/messages.json';
  messages: Message[] = [];
  maxMessageId = 0;
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {}

  getMessages(): Message[] {
    this.http.get<Message[]>(this.firebaseUrl).subscribe({
      next: (messages) => {
        this.messages = messages ?? [];
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
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.firebaseUrl, JSON.stringify(this.messages), { headers })
      .subscribe({
        next: () => this.messageChangedEvent.emit(this.messages.slice()),
        error: (error) => console.error(error)
      });
  }
}
