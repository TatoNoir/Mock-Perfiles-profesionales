import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiQuestion } from '../../services/users.service';

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.css']
})
export class CommentsModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() questions: ApiQuestion[] = [];
  @Input() userName = '';
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Component initialization
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
