import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/documents';
  documents: Document[] = [];
  maxDocumentId = 0;

  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {}

  getDocuments(): Document[] {
    this.http.get<{ message: string; documents: Document[] }>(this.apiUrl).subscribe({
      next: (responseData) => {
        this.documents = responseData.documents ?? [];
        this.maxDocumentId = this.getMaxId();
        this.sortAndSend();
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

    newDocument.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; document: Document }>(this.apiUrl, newDocument, { headers })
      .subscribe({
        next: (responseData) => {
          this.documents.push(responseData.document);
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.apiUrl + '/' + originalDocument.id, newDocument, { headers })
      .subscribe({
        next: () => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        error: (error) => console.error(error)
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.apiUrl + '/' + document.id).subscribe({
      next: () => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      },
      error: (error) => console.error(error)
    });
  }

  sortAndSend() {
    this.documents.sort((a, b) => a.name.localeCompare(b.name));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
