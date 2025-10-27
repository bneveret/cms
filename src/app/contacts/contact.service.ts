import {Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contacts: Contact [] =[];
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
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
    if (!newContact) return;

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);

    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find(c => c.id === id);
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }
}