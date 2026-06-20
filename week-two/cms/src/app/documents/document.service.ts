import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private firebaseUrl =
    'https://cms-assignment-11626-default-rtdb.firebaseio.com/documents.json';
  documents: Document[] = [];
  maxDocumentId = 0;

  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {}

  getDocuments(): Document[] {
    this.http.get<Document[]>(this.firebaseUrl).subscribe({
      next: (documents) => {
        this.documents = documents ?? [];
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (error) => console.error(error)
    });

    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }

    return null;
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

  storeDocuments() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.firebaseUrl, JSON.stringify(this.documents), { headers })
      .subscribe({
        next: () => {
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error) => console.error(error)
      });
  }
}
