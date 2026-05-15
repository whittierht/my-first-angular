import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../document.model';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  imports: [CommonModule, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css'
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      '1',
      'CIT 360 - Java Programming',
      'Notes, examples, and assignments from my Java programming class.',
      'https://www.byui.edu',
      null
    ),
    new Document(
      '2',
      'CIT 261 - Mobile Application Development',
      'Stuff from my mobile app class, including a few project notes and reminders.',
      'https://www.byui.edu',
      null
    ),
    new Document(
      '3',
      'CIT 262 - Object-Oriented Programming',
      'Class notes about objects, classes, and how to organize code better.',
      'https://www.byui.edu',
      null
    ),
    new Document(
      '4',
      'CIT 366 - Full Web Stack Development',
      'Web stack notes for front end, back end, and conecting everything together.',
      'https://www.byui.edu',
      null
    ),
    new Document(
      '5',
      'CIT 336 - Web Backend Development',
      'Backend notes for servers, routes, and working with data.',
      'https://www.byui.edu',
      null
    )
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}