import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  imports: [],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css'
})
export class MessageEdit {
  @ViewChild('subject') subjectInput!: ElementRef;
  @ViewChild('msgText') msgTextInput!: ElementRef;

  currentSender = '7';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    const newMessage = new Message(
      Date.now().toString(),
      subject,
      msgText,
      this.currentSender
    );

    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgTextInput.nativeElement.value = '';
  }
}