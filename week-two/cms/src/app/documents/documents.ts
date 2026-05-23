import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from './document.model';
import { DocumentList } from './document-list/document-list';
import { DocumentDetail } from './document-detail/document-detail';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  imports: [CommonModule, DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents implements OnInit {
  selectedDocument!: Document;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    
    this.documentService.documentSelectedEvent.subscribe((document: Document) => {
      this.selectedDocument = document;
    });
  }
}