import { Component } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css'
})
export class ContactDetail {
  contact: Contact = new Contact(
    '1',
    'R. Kent Jackson',
    'jacksonk@byui.edu',
    '208-496-3771',
    'assets/images/jacksonk.jpg',
    null
  );
}
