import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css'
})
export class ContactItem {
  @Input() contact!: Contact;
}