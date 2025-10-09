import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesService, CreateActivityRequest } from './services/activities.service';

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Agregar Nueva Actividad</h3>
          <button class="close-btn" (click)="onClose()" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #form="ngForm" class="modal-body">
          <div class="field">
            <label for="name">Nombre de la actividad *</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              [(ngModel)]="formData.name" 
              required 
              placeholder="Ej: Electricista"
            />
          </div>

          <div class="field">
            <label for="short_code">Código corto *</label>
            <input 
              id="short_code" 
              name="short_code" 
              type="text" 
              [(ngModel)]="formData.short_code" 
              required 
              placeholder="Ej: ELE"
            />
          </div>

          <div class="field">
            <label for="code">Código *</label>
            <input 
              id="code" 
              name="code" 
              type="text" 
              [(ngModel)]="formData.code" 
              required 
              placeholder="Ej: ACT001"
            />
          </div>

          <div class="field">
            <label for="tags">Tags</label>
            <input 
              id="tags" 
              name="tags" 
              type="text" 
              [(ngModel)]="formData.tags" 
              placeholder="Ej: instalaciones, cables, energía"
            />
          </div>

          <div class="field">
            <label for="disabled">Estado</label>
            <select id="disabled" name="disabled" [(ngModel)]="formData.disabled">
              <option [ngValue]="0">Activa</option>
              <option [ngValue]="1">Inactiva</option>
            </select>
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>
        </form>

        <div class="modal-footer">
          <button type="button" class="btn secondary" (click)="onClose()" [disabled]="loading">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn primary" 
            (click)="onSubmit()" 
            [disabled]="loading || !form.form.valid"
          >
            <svg class="icon loading" viewBox="0 0 24 24" aria-hidden="true" *ngIf="loading">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
            <span>{{ loading ? 'Creando...' : 'Crear Actividad' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 1.5rem 1.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .close-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .modal-body {
      padding: 1.5rem;
      flex: 1;
      overflow-y: auto;
    }

    .field {
      margin-bottom: 1rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .field input,
    .field select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: border-color 0.2s ease;
    }

    .field input:focus,
    .field select:focus {
      outline: none;
      border-color: #1f4c85;
      box-shadow: 0 0 0 3px rgba(31, 76, 133, 0.1);
    }

    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
    }

    .modal-footer {
      padding: 0 1.5rem 1.5rem;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: 1px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn.primary {
      background: #1f4c85;
      color: #fff;
    }

    .btn.primary:hover:not(:disabled) {
      background: #1a3f73;
    }

    .btn.secondary {
      background: #f3f4f6;
      color: #374151;
      border-color: #d1d5db;
    }

    .btn.secondary:hover:not(:disabled) {
      background: #e5e7eb;
    }

    .icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .icon.loading {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class AddActivityModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() activityCreated = new EventEmitter<void>();

  formData: CreateActivityRequest = {
    name: '',
    short_code: '',
    tags: '',
    code: '',
    disabled: 0
  };

  loading = false;
  error: string | null = null;

  constructor(private activitiesService: ActivitiesService) {}

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    this.error = null;

    this.activitiesService.createActivity(this.formData)
      .subscribe({
        next: (activity) => {
          console.log('Actividad creada:', activity);
          this.activityCreated.emit();
          this.onClose();
        },
        error: (error) => {
          console.error('Error al crear actividad:', error);
          this.error = error.error?.message || error.message || 'Error al crear la actividad';
          this.loading = false;
        }
      });
  }

  private resetForm() {
    this.formData = {
      name: '',
      short_code: '',
      tags: '',
      code: '',
      disabled: 0
    };
    this.loading = false;
    this.error = null;
  }
}
