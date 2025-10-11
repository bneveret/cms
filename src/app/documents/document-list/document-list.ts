import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrl: './document-list.css'
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
    
    documents: Document[] = [
      new Document(
        '1',
        'name1',
        'description1',
        'url properties1'
      ),
      new Document(
        '2',
        'name2',
        'description2',
        'url properties2'
      ),
      new Document(
        '3',
        'name3',
        'description3',
        'url properties3'
      ),
      new Document(
        '4',
        'name4',
        'description4',
        'url properties4'
      )
      
    ];
  
    onSelected(document: Document) {
      this.selectedDocumentEvent.emit(document);
    }
}
