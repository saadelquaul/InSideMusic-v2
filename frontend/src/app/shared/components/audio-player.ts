import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerService } from '../../core/services/audio-player.service';

@Component({
    selector: 'app-audio-player',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (player.currentTrack()) {
      <div
        class="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 z-50 ml-64"
      >
        <div class="h-full max-w-7xl mx-auto px-6 flex items-center gap-6">
          <!-- Track Info -->
          <div class="flex items-center gap-4 w-64 min-w-0">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-medium text-white truncate">
                {{ player.currentTrack()?.title }}
              </p>
              <p class="text-sm text-zinc-400 truncate">
                {{ player.currentTrack()?.artist }}
              </p>
            </div>
          </div>

          <!-- Controls & Progress -->
          <div class="flex-1 flex flex-col items-center gap-2">
            <!-- Playback Controls -->
            <div class="flex items-center gap-4">
              <button
                (click)="player.previous()"
                class="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Previous"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                (click)="togglePlay()"
                class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                title="{{ player.isPlaying() ? 'Pause' : 'Play' }}"
              >
                @if (player.isPlaying()) {
                  <svg class="w-5 h-5 text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                } @else {
                  <svg class="w-5 h-5 text-zinc-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                }
              </button>

              <button
                (click)="player.next()"
                class="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Next"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            <!-- Progress Bar -->
            <div class="w-full max-w-xl flex items-center gap-3">
              <span class="text-xs text-zinc-400 w-10 text-right">
                {{ player.formatTime(player.currentTime()) }}
              </span>
              <div
                class="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer group"
                (click)="onProgressClick($event)"
              >
                <div
                  class="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full relative"
                  [style.width.%]="player.progress()"
                >
                  <div
                    class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  ></div>
                </div>
              </div>
              <span class="text-xs text-zinc-400 w-10">
                {{ player.formatTime(player.duration()) }}
              </span>
            </div>
          </div>

          <!-- Volume Control -->
          <div class="flex items-center gap-2 w-32">
            <button
              (click)="toggleMute()"
              class="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              @if (player.volume() === 0) {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                  />
                </svg>
              } @else if (player.volume() < 0.5) {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                  />
                </svg>
              }
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              [value]="player.volume()"
              (input)="onVolumeChange($event)"
              class="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-violet-500"
            />
          </div>
        </div>
      </div>
    }
  `,
    styles: [
        `
      :host {
        display: contents;
      }
      input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
      }
    `,
    ],
})
export class AudioPlayerComponent {
    player = inject(AudioPlayerService);
    private lastVolume = 0.7;

    togglePlay(): void {
        if (this.player.isPlaying()) {
            this.player.pause();
        } else {
            this.player.play();
        }
    }

    toggleMute(): void {
        if (this.player.volume() > 0) {
            this.lastVolume = this.player.volume();
            this.player.setVolume(0);
        } else {
            this.player.setVolume(this.lastVolume);
        }
    }

    onProgressClick(event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const percent = ((event.clientX - rect.left) / rect.width) * 100;
        this.player.seekPercent(percent);
    }

    onVolumeChange(event: Event): void {
        const value = parseFloat((event.target as HTMLInputElement).value);
        this.player.setVolume(value);
    }
}
