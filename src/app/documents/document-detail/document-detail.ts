import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WindRef } from '../../wind-ref';

@Component({
  selector: 'cms-document-detail',
  standalone: false,
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css'
})
export class DocumentDetail implements OnInit, OnDestroy {
  document: Document | null = null;
  nativeWindow: any;
  private listSub: Subscription | null = null;
  private paramsSub: Subscription | null = null;
  private currentId: string | null = null;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private windRefService: WindRef
  ) {}

  ngOnInit() {
    // Subscribe to route params so we know which document id to show.
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.currentId = params['id'];

      // Try to get the document synchronously first.
      this.document = this.documentService.getDocument(this.currentId!);

      // If it isn't available yet, subscribe to the document list changed event
      // and trigger a load of documents if they haven't been fetched.
      if (!this.document) {
        if (!this.listSub) {
          this.listSub = this.documentService.documentListChangedEvent.subscribe(() => {
            if (this.currentId) {
              this.document = this.documentService.getDocument(this.currentId);
            }
          });
        }

        if (!this.documentService.documents || this.documentService.documents.length === 0) {
          this.documentService.getDocuments();
        }
      }
    });

    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  onView() {
    if (this.document && this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    if (!this.document) {
      return;
    }

    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

  ngOnDestroy() {
    if (this.listSub) {
      this.listSub.unsubscribe();
      this.listSub = null;
    }
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
      this.paramsSub = null;
    }
  }
}
