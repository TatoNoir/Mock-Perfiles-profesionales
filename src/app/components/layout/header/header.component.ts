import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
  dropdownOpen = false;

  toggleDropdown() { this.dropdownOpen = !this.dropdownOpen; }
  onMisDatos() { 
    this.dropdownOpen = false; 
    this.router.navigateByUrl('/mis-datos');
  }
  constructor(private router: Router, private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.dropdownOpen) return;
    const clickedInside = this.elRef.nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
