import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private firebaseUrl =
    'https://cms-assignment-11626-default-rtdb.firebaseio.com/contacts.json';
  contacts: Contact[] = [];
  maxContactId = 0;

  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContacts(): Contact[] {
    this.http.get<Contact[]>(this.firebaseUrl).subscribe({
      next: (contacts) => {
        this.contacts = contacts ?? [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (error) => console.error(error)
    });

    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }

    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);

    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  storeContacts() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.firebaseUrl, JSON.stringify(this.contacts), { headers })
      .subscribe({
        next: () => {
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => console.error(error)
      });
  }
}
