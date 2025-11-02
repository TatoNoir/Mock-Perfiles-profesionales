import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  private currentValue = '';
  
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentValue = target.value;
    this.search.emit(this.currentValue.trim());
  }
  
  emitSearch() { 
    this.search.emit(this.currentValue.trim()); 
  }
}
