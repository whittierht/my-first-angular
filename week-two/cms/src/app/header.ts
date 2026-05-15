import { Component, EventEmitter, Output } from '@angular/core';
import { Dropdown } from './shared/dropdown';

@Component({
  selector: 'cms-header',
  imports: [Dropdown],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Output() selectedFeatureEvent = new EventEmitter<string>();

  onSelected(selectedEvent: string) {
    this.selectedFeatureEvent.emit(selectedEvent);
  }
}