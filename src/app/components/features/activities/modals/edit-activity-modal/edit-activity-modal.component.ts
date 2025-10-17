import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivitiesService, Activity, CreateActivityRequest } from '../../services/activities.service';

@Component({
  selector: 'app-edit-activity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-activity-modal.component.html',
  styleUrls: ['./edit-activity-modal.component.css']
})
export class EditActivityModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() activity: Activity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() activityUpdated = new EventEmitter<Activity>();

  editForm!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private activitiesService: ActivitiesService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.activity) {
      this.populateForm();
    }
  }

  ngOnChanges() {
    if (this.activity) {
      this.populateForm();
    }
  }

  private initializeForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      short_code: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      tags: [''],
      disabled: [0, Validators.required]
    });
  }

  private populateForm() {
    if (this.activity) {
      this.editForm.patchValue({
        name: this.activity.activity,
        short_code: (this.activity as any).short_code || '',
        code: (this.activity as any).code || '',
        tags: this.activity.tags || '',
        disabled: this.activity.status === 'Activa' ? 0 : 1
      });
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.activity) {
      this.loading = true;
      this.error = null;

      const formValue = this.editForm.value;
      const request: CreateActivityRequest = {
        name: formValue.name,
        short_code: formValue.short_code,
        tags: formValue.tags,
        code: formValue.code,
        disabled: formValue.disabled
      };

      this.activitiesService.updateActivityFromApi(this.activity.id, request)
        .subscribe({
          next: (updatedActivity) => {
            this.loading = false;
            this.activityUpdated.emit(updatedActivity);
            this.onClose();
          },
          error: (error) => {
            this.loading = false;
            this.error = error.error?.error || error.error || 'Error al actualizar la actividad';
          }
        });
    }
  }

  onClose() {
    this.close.emit();
  }
}
