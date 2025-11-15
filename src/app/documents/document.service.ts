import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.maxDocumentId = 0;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);
    this.storeDocuments();
    }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  getDocuments() {
    this.http
    .get<Document[]>('https://cms-project-e0678-default-rtdb.firebaseio.com/documents.json')
    .subscribe(
      (documents: Document[]) => {
        this.documents = documents || [];
        this.maxDocumentId = this.getMaxId();

        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.documentListChangedEvent.next(this.documents.slice());
      },

      (error: any) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  storeDocuments() {
  const documentsJson = JSON.stringify(this.documents);

  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  this.http
    .put('https://cms-project-e0678-default-rtdb.firebaseio.com/documents.json', documentsJson, { headers })
    .subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice());
    });
}

  getDocument(id: string): Document | null {
    return this.documents.find(doc => doc.id === id) || null;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
