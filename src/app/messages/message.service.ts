import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number = 0;
  
  constructor(private http: HttpClient) {}

  getMessages() {
    this.http
      .get<Message[]>('https://cms-project-e0678-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages ?? [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (let msg of this.messages) {
      const currentId = +msg.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessage(id: string): Message | null {
    return this.messages.find((message) => message.id === id) || null;
  }

  addMessage(message: Message) {
    if (!message) return;

    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const msgString = JSON.stringify(this.messages);

    this.http
      .put(
        'https://https://cms-project-e0678-default-rtdb.firebaseio.com/messages.json',
        msgString,
        { headers }
      )
      .subscribe(() => {
        this.messageChangedEvent.next(this.messages.slice());
      });
  }
}
