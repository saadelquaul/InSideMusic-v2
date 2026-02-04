import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Track, TrackFormData } from '../../core/models/track.model';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { TrackFormComponent } from '../library/components/track-form';
import * as TrackActions from '../../store/track/track.actions';
import * as TrackSelectors from '../../store/track/track.selectors';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TrackFormComponent],
  template: `
    <div class="min-h-screen bg-zinc-950 ml-64 pb-24">
      @if (track()) {
        <!-- Hero Section -->
        <div class="relative">
          <div
            class="absolute inset-0 bg-gradient-to-b from-violet-900/30 to-zinc-950"
          ></div>
          <div
            class="relative max-w-7xl mx-auto px-6 pt-12 pb-8 flex items-end gap-8"
          >
            <!-- Album Art -->
            <div
              class="w-56 h-56 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/20 flex-shrink-0"
            >
              <svg class="w-24 h-24 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                />
              </svg>
            </div>

            <!-- Track Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-violet-400 uppercase tracking-wider mb-2">
                Track
              </p>
              <h1 class="text-5xl font-bold text-white mb-4 truncate">
                {{ track()?.title }}
              </h1>
              <div class="flex items-center gap-4 text-zinc-300">
                <span class="font-medium">{{ track()?.artist }}</span>
                <span class="text-zinc-500">•</span>
                <span
                  class="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-sm capitalize"
                >
                  {{ track()?.categoryName }}
                </span>
                <span class="text-zinc-500">•</span>
                <span class="text-zinc-400">
                  {{ formatDuration(track()?.duration || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Bar -->
        <div class="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <button
            (click)="onPlay()"
            class="w-14 h-14 rounded-full bg-violet-500 flex items-center justify-center hover:scale-105 hover:bg-violet-400 transition-all shadow-lg shadow-violet-500/30"
          >
            @if (isCurrentlyPlaying()) {
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            } @else {
              <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            }
          </button>

          <button
            (click)="showEditForm.set(true)"
            class="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Edit"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            (click)="showDeleteConfirm.set(true)"
            class="p-3 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <!-- Description -->
        @if (track()?.description) {
          <div class="max-w-7xl mx-auto px-6 py-6">
            <h2 class="text-lg font-semibold text-white mb-3">About</h2>
            <p class="text-zinc-400 leading-relaxed max-w-2xl">
              {{ track()?.description }}
            </p>
          </div>
        }

        <!-- Details -->
        <div class="max-w-7xl mx-auto px-6 py-6">
          <h2 class="text-lg font-semibold text-white mb-4">Track Details</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
              <p class="text-sm text-zinc-500 mb-1">Duration</p>
              <p class="text-white font-medium">
                {{ formatDuration(track()?.duration || 0) }}
              </p>
            </div>
            <div class="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
              <p class="text-sm text-zinc-500 mb-1">Category</p>
              <p class="text-white font-medium capitalize">{{ track()?.categoryName }}</p>
            </div>
            <div class="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
              <p class="text-sm text-zinc-500 mb-1">Added</p>
              <p class="text-white font-medium">
                {{ track()?.dateAdded | date : 'MMM d, yyyy' }}
              </p>
            </div>
            <div class="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
              <p class="text-sm text-zinc-500 mb-1">Artist</p>
              <p class="text-white font-medium">{{ track()?.artist }}</p>
            </div>
          </div>
        </div>

        <!-- Back Link -->
        <div class="max-w-7xl mx-auto px-6 py-6">
          <a
            routerLink="/library"
            class="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Library
          </a>
        </div>

        <!-- Edit Modal -->
        @if (showEditForm()) {
          <app-track-form
            [track]="track()"
            (close)="showEditForm.set(false)"
            (save)="onSaveTrack($event)"
          />
        }

        <!-- Delete Confirmation -->
        @if (showDeleteConfirm()) {
          <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              class="bg-zinc-900 rounded-2xl border border-zinc-700 p-6 max-w-sm w-full"
            >
              <h3 class="text-lg font-bold text-white mb-2">Delete Track?</h3>
              <p class="text-zinc-400 mb-6">
                Are you sure you want to delete "{{ track()?.title }}"? This
                action cannot be undone.
              </p>
              <div class="flex gap-3">
                <button
                  (click)="showDeleteConfirm.set(false)"
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
      } @else {
        <!-- Loading or Not Found -->
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h2 class="text-xl font-bold text-white mb-2">Track not found</h2>
            <p class="text-zinc-400 mb-6">
              This track may have been deleted or doesn't exist.
            </p>
            <a
              routerLink="/library"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Library
            </a>
          </div>
        </div>
      }
    </div>
  `,
})
export class TrackDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private player = inject(AudioPlayerService);

  track = signal<Track | null>(null);
  showEditForm = signal(false);
  showDeleteConfirm = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(TrackActions.loadTracks());
      this.store.select(TrackSelectors.selectTrackById(id)).subscribe((track) => {
        this.track.set(track ?? null);
      });
    }
  }

  isCurrentlyPlaying(): boolean {
    const current = this.track();
    return (
      !!current &&
      this.player.currentTrack()?.id === current.id &&
      this.player.isPlaying()
    );
  }

  onPlay(): void {
    const current = this.track();
    if (!current) return;

    if (this.isCurrentlyPlaying()) {
      this.player.pause();
    } else {
      this.player.play(current);
    }
  }

  onSaveTrack(formData: TrackFormData): void {
    const current = this.track();
    if (current) {
      this.store.dispatch(TrackActions.updateTrack({ id: current.id, formData }));
      this.showEditForm.set(false);
    }
  }

  confirmDelete(): void {
    const current = this.track();
    if (current) {
      this.store.dispatch(TrackActions.deleteTrack({ id: current.id }));
      this.router.navigate(['/library']);
    }
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
