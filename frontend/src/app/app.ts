import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar';
import { AudioPlayerComponent } from './shared/components/audio-player';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AudioPlayerComponent],
  template: `
    <div class="min-h-screen bg-zinc-950">
      <app-sidebar />
      <main>
        <router-outlet />
      </main>
      <app-audio-player />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class App { }
