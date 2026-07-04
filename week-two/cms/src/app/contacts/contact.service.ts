import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts';
  contacts: Contact[] = [];
  maxContactId = 0;

  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContacts(): Contact[] {
    this.http.get<{ message: string; contacts: Contact[] }>(this.apiUrl).subscribe({
      next: (responseData) => {
        this.contacts = responseData.contacts ?? [];
        this.maxContactId = this.getMaxId();
        this.sortAndSend();
      },
      error: (error) => console.error(error)
    });

    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id || contact._id === id) {
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

    newContact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; contact: Contact }>(this.apiUrl, newContact, { headers })
      .subscribe({
        next: (responseData) => {
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.apiUrl + '/' + originalContact.id, newContact, { headers })
      .subscribe({
        next: () => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((c) => c.id === contact.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.apiUrl + '/' + contact.id).subscribe({
      next: () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error) => console.error(error)
    });
  }

  sortAndSend() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
