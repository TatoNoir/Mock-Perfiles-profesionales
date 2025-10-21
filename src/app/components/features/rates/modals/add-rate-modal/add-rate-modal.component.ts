import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RatesService, Rate } from '../../services/rates.service';

@Component({
  selector: 'app-add-rate-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-rate-modal.component.html',
  styleUrls: ['./add-rate-modal.component.css']
})
export class AddRateModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() rateCreated = new EventEmitter<Rate>();

  addForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ratesService: RatesService
  ) {
    this.addForm = this.fb.group({
      value: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      comment: ['', [Validators.required]],
      user_id: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // No hay inicialización especial necesaria
  }

  onClose(): void {
    if (!this.loading) {
      this.addForm.reset();
      this.addForm.patchValue({
        value: 5
      });
      this.error = null;
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.addForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      const formValue = this.addForm.value;
      const newRate = {
        value: parseInt(formValue.value),
        email: formValue.email,
        name: formValue.name,
        comment: formValue.comment,
        user_id: parseInt(formValue.user_id)
      };

      this.ratesService.createRate(newRate).subscribe({
        next: (createdRate) => {
          this.loading = false;
          this.rateCreated.emit(createdRate);
          this.onClose();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al crear valoración:', error);
          this.error = 'Error al crear la valoración. Por favor, intente nuevamente.';
        }
      });
    }
  }

  getStars(value: number): string {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  }

  onRatingChange(value: number): void {
    this.addForm.patchValue({ value });
  }
}
