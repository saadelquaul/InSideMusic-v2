import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TrackCardComponent } from './components/track-card';
import { TrackFormComponent } from './components/track-form';
import { Track, TrackFormData, CategoryDTO } from '../../core/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { CategoryService } from '../../core/services/category.service';
import * as TrackActions from '../../store/track/track.actions';
import * as TrackSelectors from '../../store/track/track.selectors';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, TrackCardComponent, TrackFormComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 ml-64 pb-24">
      <!-- Header -->
      <header
        class="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800"
      >
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-white">Your Library</h1>
              <p class="text-zinc-400 text-sm mt-1">
                {{ tracksCount() }} {{ tracksCount() === 1 ? 'track' : 'tracks' }}
              </p>
            </div>

            <button
              (click)="showAddForm.set(true)"
              class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Track
            </button>
          </div>

          <!-- Search & Filters -->
          <div class="flex gap-4 mt-4">
            <!-- Search -->
            <div class="flex-1 relative">
              <svg
                class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="Search by title or artist..."
                class="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <!-- Category Filter -->
            <select
              [(ngModel)]="selectedCategory"
              (ngModelChange)="onSearchChange()"
              class="px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            >
              <option value="">All Categories</option>
              @for (cat of categories; track cat.id) {
                <option [value]="cat.name">{{ cat.name | titlecase }}</option>
              }
            </select>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="max-w-7xl mx-auto px-6 py-8">
        @if (isLoading()) {
          <div class="flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-4">
              <svg class="w-12 h-12 text-violet-500 animate-spin" viewBox="0 0 24 24">
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
              <p class="text-zinc-400">Loading your music...</p>
            </div>
          </div>
        } @else if (filteredTracks().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 text-center">
            <div
              class="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-6"
            >
              <svg
                class="w-12 h-12 text-zinc-600"
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
            </div>
            @if (searchQuery || selectedCategory) {
              <h2 class="text-xl font-bold text-white mb-2">No tracks found</h2>
              <p class="text-zinc-400 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                (click)="clearFilters()"
                class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            } @else {
              <h2 class="text-xl font-bold text-white mb-2">
                Your library is empty
              </h2>
              <p class="text-zinc-400 mb-6">
                Add your first track to get started
              </p>
              <button
                (click)="showAddForm.set(true)"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Your First Track
              </button>
            }
          </div>
        } @else {
          <!-- Track Grid -->
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            @for (track of filteredTracks(); track track.id) {
              <app-track-card
                [track]="track"
                (edit)="onEditTrack($event)"
                (delete)="onDeleteTrack($event)"
              />
            }
          </div>
        }
      </main>

      <!-- Add/Edit Form Modal -->
      @if (showAddForm() || editingTrack()) {
        <app-track-form
          [track]="editingTrack()"
          (close)="closeForm()"
          (save)="onSaveTrack($event)"
        />
      }

      <!-- Delete Confirmation -->
      @if (deletingTrack()) {
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div class="bg-zinc-900 rounded-2xl border border-zinc-700 p-6 max-w-sm w-full">
            <h3 class="text-lg font-bold text-white mb-2">Delete Track?</h3>
            <p class="text-zinc-400 mb-6">
              Are you sure you want to delete "{{ deletingTrack()?.title }}"? This
              action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button
                (click)="deletingTrack.set(null)"
                class="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                (click)="confirmDelete()"
                class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class LibraryComponent implements OnInit {
  private store = inject(Store);
  private player = inject(AudioPlayerService);
  private categoryService = inject(CategoryService);

  categories: CategoryDTO[] = [];
  searchQuery = '';
  selectedCategory = '';

  showAddForm = signal(false);
  editingTrack = signal<Track | null>(null);
  deletingTrack = signal<Track | null>(null);

  private allTracks = this.store.selectSignal(TrackSelectors.selectAllTracks);
  isLoading = this.store.selectSignal(TrackSelectors.selectIsLoading);
  tracksCount = computed(() => this.allTracks().length);

  private searchSignal = signal('');
  private categorySignal = signal('');

  filteredTracks = computed(() => {
    let tracks = this.allTracks();
    const search = this.searchSignal().toLowerCase();
    const category = this.categorySignal().toLowerCase();

    if (search) {
      tracks = tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.artist.toLowerCase().includes(search)
      );
    }

    if (category) {
      tracks = tracks.filter((t) => t.categoryName?.toLowerCase() === category);
    }

    return tracks;
  });

  ngOnInit(): void {
    this.store.dispatch(TrackActions.loadTracks());
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

  onSearchChange(): void {
    this.searchSignal.set(this.searchQuery);
    this.categorySignal.set(this.selectedCategory);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.onSearchChange();
  }

  onEditTrack(track: Track): void {
    this.editingTrack.set(track);
  }

  onDeleteTrack(track: Track): void {
    this.deletingTrack.set(track);
  }

  confirmDelete(): void {
    const track = this.deletingTrack();
    if (track) {
      this.store.dispatch(TrackActions.deleteTrack({ id: track.id }));
      this.deletingTrack.set(null);
    }
  }

  onSaveTrack(formData: TrackFormData): void {
    const editing = this.editingTrack();
    if (editing) {
      this.store.dispatch(
        TrackActions.updateTrack({ id: editing.id, formData })
      );
    } else {
      this.store.dispatch(TrackActions.addTrack({ formData }));
    }
    this.closeForm();

    // Update playlist
    setTimeout(() => {
      this.player.setPlaylist(this.allTracks());
    }, 500);
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingTrack.set(null);
  }
}
