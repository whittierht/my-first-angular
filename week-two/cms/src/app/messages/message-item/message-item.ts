import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';



@Component({
  selector: 'cms-message-item',
  imports: [],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css'
})
export class MessageItem implements OnInit {
  @Input() message!: Message;
  messageSender = '';


  
  constructor(private contactService: ContactService) {}

  ngOnInit() {
    if (this.message.sender && typeof this.message.sender !== 'string') {
      this.messageSender = this.message.sender.name;
      return;
    }

    const contact: Contact | null = this.message.sender
      ? this.contactService.getContact(this.message.sender)
      : null;

    if (contact) {
      this.messageSender = contact.name;
    }
  }
}
