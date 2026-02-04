import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <aside
      class="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800 flex flex-col z-40"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-zinc-800">
        <a routerLink="/" class="flex items-center gap-3 group">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow"
          >
            <svg
              class="w-6 h-6 text-white"
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
          <span
            class="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
          >
            MusicStream
          </span>
        </a>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <a
          routerLink="/library"
          routerLinkActive="bg-violet-500/10 text-violet-400 border-violet-500/30"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent transition-all group"
        >
          <svg
            class="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span class="font-medium">Library</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-zinc-800">
        <div class="text-xs text-zinc-500 text-center">
          © 2024 MusicStream
        </div>
      </div>
    </aside>
  `,
    styles: [
        `
      :host {
        display: contents;
      }
    `,
    ],
})
export class SidebarComponent { }
