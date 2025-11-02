import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.css']
})
export class FiltersPanelComponent {
  @Output() search = new EventEmitter<string>();
  
  emitSearch(term: string) { 
    this.search.emit(term); 
  }
}
