import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  term: string ='';
  private subscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.getContacts();

    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
      }
    );
  }

    ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    }

  onSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

  search(value: string) {
    this.term = value;
  }
}
