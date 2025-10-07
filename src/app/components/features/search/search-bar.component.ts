import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-bar">
      <input
        type="text"
        class="search-input"
        placeholder="Buscar profesionales por nombre"
        (input)="onInput($event)"
      >
      <button class="search-button" (click)="emitSearch()">Buscar</button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
      margin-left: 1rem;
      max-width: 700px;
    }

    .search-input {
      flex: 1;
      margin-top: 0.5rem;
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #4a90e2;
    }

    .search-button {
      padding: 0.75rem 2.5rem;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .search-button:hover {
      background-color: #357abd;
    }
  `]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  private currentValue = '';
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentValue = target.value;
    this.search.emit(this.currentValue.trim());
  }
  emitSearch() { this.search.emit(this.currentValue.trim()); }
}
