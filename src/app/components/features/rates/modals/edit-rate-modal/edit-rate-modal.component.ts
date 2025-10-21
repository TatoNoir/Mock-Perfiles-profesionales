import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RatesService, Rate } from '../../services/rates.service';

@Component({
  selector: 'app-edit-rate-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-rate-modal.component.html',
  styleUrls: ['./edit-rate-modal.component.css']
})
export class EditRateModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() rate: Rate | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() rateUpdated = new EventEmitter<Rate>();

  editForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ratesService: RatesService
  ) {
    this.editForm = this.fb.group({
      answer: [''],
      published: [false]
    });
  }

  ngOnInit(): void {
    if (this.rate) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rate'] && this.rate) {
      this.populateForm();
    }
  }

  private populateForm(): void {
    if (this.rate) {
      this.editForm.patchValue({
        answer: this.rate.answer || '',
        published: this.rate.published || false
      });
    }
  }

  onClose(): void {
    if (!this.loading) {
      this.editForm.reset();
      this.editForm.patchValue({
        answer: '',
        published: false
      });
      this.error = null;
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && !this.loading && this.rate) {
      this.loading = true;
      this.error = null;

      const formValue = this.editForm.value;
      const updateData = {
        answer: formValue.answer,
        published: formValue.published
      };

      this.ratesService.updateRate(this.rate.id!, updateData).subscribe({
        next: (updatedRate) => {
          this.loading = false;
          this.rateUpdated.emit(updatedRate);
          this.onClose();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al actualizar valoración:', error);
          this.error = 'Error al actualizar la valoración. Por favor, intente nuevamente.';
        }
      });
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStars(value: number): string {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  }
}
