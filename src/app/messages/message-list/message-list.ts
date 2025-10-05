import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList {
  messages: Message[] = [
    new Message('1', 'This is a Subject', 'This is a message', 'Brent Everett'),
    new Message('2', 'Hi', 'Hello There.', 'Obi Wan'),
    new Message('3', 'surprised', 'General Kenobi', 'Optimus Prime')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
