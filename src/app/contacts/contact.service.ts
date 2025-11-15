import {Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import {Contact} from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contacts: Contact [] = [];
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = 0;
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
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  getContacts() {
    this.http
      .get<Contact[]>('https://cms-project-e0678-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts ?? [];
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
          );
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error(error);
      }
    );
  }

  getContact(id: string): Contact {
    return this.contacts.find(c => c.id === id);
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  storeContacts() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const contactString = JSON.stringify(this.contacts);

    this.http
      .put(
        'https://cms-project-e0678-default-rtdb.firebaseio.com/contacts.json',
        contactString,
        { headers }
      )
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }
}