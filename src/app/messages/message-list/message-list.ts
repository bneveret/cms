import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList implements OnInit, OnDestroy {
  messages: Message[] = [];
  private subscription: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getMessages();
    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
