import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Track, TrackFormData, CategoryDTO } from '../../../core/models/track.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      (click)="onBackdropClick($event)"
    >
      <!-- Modal -->
      <div
        class="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 class="text-xl font-bold text-white">
            {{ track ? 'Edit Track' : 'Add New Track' }}
          </h2>
          <button
            (click)="close.emit()"
            class="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">Title *</label>
            <input
              type="text"
              formControlName="title"
              maxlength="50"
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              placeholder="Enter track title"
            />
            @if (form.get('title')?.invalid && form.get('title')?.touched) {
              <p class="mt-1 text-sm text-red-400">
                Title is required (max 50 characters)
              </p>
            }
            <p class="mt-1 text-xs text-zinc-500 text-right">
              {{ form.get('title')?.value?.length || 0 }}/50
            </p>
          </div>

          <!-- Artist -->
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">Artist *</label>
            <input
              type="text"
              formControlName="artist"
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              placeholder="Enter artist name"
            />
            @if (form.get('artist')?.invalid && form.get('artist')?.touched) {
              <p class="mt-1 text-sm text-red-400">Artist is required</p>
            }
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              formControlName="description"
              maxlength="200"
              rows="3"
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
              placeholder="Add a description (optional)"
            ></textarea>
            <p class="mt-1 text-xs text-zinc-500 text-right">
              {{ form.get('description')?.value?.length || 0 }}/200
            </p>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">
              Category *
            </label>
            <select
              formControlName="categoryId"
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            >
              <option value="">Select a category</option>
              @for (cat of categories; track cat.id) {
                <option [value]="cat.id">{{ cat.name | titlecase }}</option>
              }
            </select>
            @if (form.get('categoryId')?.invalid && form.get('categoryId')?.touched) {
              <p class="mt-1 text-sm text-red-400">Category is required</p>
            }
          </div>

          <!-- Audio File -->
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">
              Audio File {{ track ? '(optional)' : '*' }}
            </label>
            <div
              class="relative border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-violet-500 transition-colors"
              [class.border-violet-500]="selectedFile"
              (dragover)="onDragOver($event)"
              (drop)="onDrop($event)"
            >
              @if (selectedFile) {
                <div class="flex items-center justify-center gap-3">
                  <svg
                    class="w-8 h-8 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <div class="text-left">
                    <p class="text-white font-medium">{{ selectedFile.name }}</p>
                    <p class="text-sm text-zinc-400">
                      {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    (click)="removeFile()"
                    class="p-1 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <svg
                      class="w-5 h-5 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              } @else {
                <svg
                  class="w-10 h-10 text-zinc-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p class="text-zinc-400 mb-1">
                  Drag & drop your audio file here
                </p>
                <p class="text-sm text-zinc-500">or</p>
                <label
                  class="inline-block mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Browse Files
                  <input
                    type="file"
                    accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
                    class="hidden"
                    (change)="onFileSelect($event)"
                  />
                </label>
              }
            </div>
            <p class="mt-2 text-xs text-zinc-500">MP3, WAV, OGG • Max 10MB</p>
            @if (fileError) {
              <p class="mt-1 text-sm text-red-400">{{ fileError }}</p>
            }
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              (click)="close.emit()"
              class="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || (!track && !selectedFile) || isSubmitting"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSubmitting) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving...
                </span>
              } @else {
                {{ track ? 'Save Changes' : 'Add Track' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class TrackFormComponent implements OnInit {
  @Input() track: Track | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TrackFormData>();

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  form!: FormGroup;
  categories: CategoryDTO[] = [];
  selectedFile: File | null = null;
  fileError: string | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [
        this.track?.title || '',
        [Validators.required, Validators.maxLength(50)],
      ],
      artist: [this.track?.artist || '', [Validators.required]],
      description: [this.track?.description || '', [Validators.maxLength(200)]],
      categoryId: [this.track?.categoryId || '', [Validators.required]],
    });

    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) this.validateAndSetFile(file);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.validateAndSetFile(file);
  }

  private validateAndSetFile(file: File): void {
    this.fileError = null;

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    if (!validTypes.includes(file.type)) {
      this.fileError = 'Invalid format. Use MP3, WAV, or OGG.';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.fileError = 'File too large. Maximum size is 10MB.';
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileError = null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (!this.track && !this.selectedFile) return;

    const formData: TrackFormData = {
      ...this.form.value,
      audioFile: this.selectedFile || undefined,
    };

    this.isSubmitting = true;
    this.save.emit(formData);
  }
}
