import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../message.model';
import { MessageItem } from '../message-item/message-item';
import { MessageEdit } from '../message-edit/message-edit';

@Component({
  selector: 'cms-message-list',
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css'
})
export class MessageList {
  messages: Message[] = [
    new Message('1', 'Welcome', 'Welcome to the CMS message center.', 'Brother Smith'),
    new Message('2', 'Angular', 'Remember to finish your Angular assignment.', 'Sister Johnson'),
    new Message('3', 'Project Update', 'The CMS project is coming together.', 'Hyrum Whittier')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}