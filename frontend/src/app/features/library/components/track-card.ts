import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Track } from '../../../core/models/track.model';
import { AudioPlayerService } from '../../../core/services/audio-player.service';

@Component({
    selector: 'app-track-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div
      class="group relative bg-zinc-800/50 hover:bg-zinc-800 rounded-xl p-4 transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600"
    >
      <!-- Album Art Placeholder -->
      <div class="relative mb-4">
        <div
          class="aspect-square rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center overflow-hidden"
        >
          <svg class="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
            />
          </svg>
        </div>

        <!-- Play overlay -->
        <button
          (click)="onPlay($event)"
          class="absolute bottom-2 right-2 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/30 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-violet-400"
        >
          @if (isCurrentlyPlaying) {
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          } @else {
            <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          }
        </button>
      </div>

      <!-- Track Info -->
      <a [routerLink]="['/track', track.id]" class="block">
        <h3 class="font-semibold text-white truncate hover:underline">
          {{ track.title }}
        </h3>
        <p class="text-sm text-zinc-400 truncate mt-1">{{ track.artist }}</p>
      </a>

      <!-- Meta -->
      <div class="flex items-center justify-between mt-3">
        <span
          class="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 capitalize"
        >
          {{ track.categoryName }}
        </span>
        <span class="text-xs text-zinc-500">{{ formatDuration(track.duration) }}</span>
      </div>

      <!-- Actions Menu -->
      <div
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="flex gap-1">
          <button
            (click)="edit.emit(track)"
            class="p-2 rounded-lg bg-zinc-700/80 hover:bg-zinc-600 text-zinc-300 hover:text-white transition-colors"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            (click)="delete.emit(track)"
            class="p-2 rounded-lg bg-zinc-700/80 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TrackCardComponent {
    @Input({ required: true }) track!: Track;
    @Output() edit = new EventEmitter<Track>();
    @Output() delete = new EventEmitter<Track>();

    private player = inject(AudioPlayerService);

    get isCurrentlyPlaying(): boolean {
        return (
            this.player.currentTrack()?.id === this.track.id && this.player.isPlaying()
        );
    }

    onPlay(event: Event): void {
        event.stopPropagation();
        if (this.isCurrentlyPlaying) {
            this.player.pause();
        } else {
            this.player.play(this.track);
        }
    }

    formatDuration(seconds: number): string {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
