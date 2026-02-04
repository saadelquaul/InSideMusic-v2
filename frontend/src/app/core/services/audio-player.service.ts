import { Injectable, signal, computed, inject } from '@angular/core';
import { Track, PlayerState } from '../models/track.model';
import { TrackService } from './track.service';

@Injectable({
    providedIn: 'root',
})
export class AudioPlayerService {
    private trackService = inject(TrackService);
    private audio = new Audio();

    // Signals for reactive state
    private _currentTrack = signal<Track | null>(null);
    private _playerState = signal<PlayerState>('stopped');
    private _volume = signal<number>(0.7);
    private _currentTime = signal<number>(0);
    private _duration = signal<number>(0);
    private _playlist = signal<Track[]>([]);

    // Public computed signals
    readonly currentTrack = this._currentTrack.asReadonly();
    readonly playerState = this._playerState.asReadonly();
    readonly volume = this._volume.asReadonly();
    readonly currentTime = this._currentTime.asReadonly();
    readonly duration = this._duration.asReadonly();
    readonly playlist = this._playlist.asReadonly();

    readonly isPlaying = computed(() => this._playerState() === 'playing');
    readonly progress = computed(() => {
        const dur = this._duration();
        return dur > 0 ? (this._currentTime() / dur) * 100 : 0;
    });

    constructor() {
        this.setupAudioListeners();
        this.audio.volume = this._volume();
    }

    private setupAudioListeners(): void {
        this.audio.addEventListener('timeupdate', () => {
            this._currentTime.set(this.audio.currentTime);
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this._duration.set(this.audio.duration);
        });

        this.audio.addEventListener('playing', () => {
            this._playerState.set('playing');
        });

        this.audio.addEventListener('pause', () => {
            if (!this.audio.ended) {
                this._playerState.set('paused');
            }
        });

        this.audio.addEventListener('ended', () => {
            this.next();
        });

        this.audio.addEventListener('waiting', () => {
            this._playerState.set('buffering');
        });

        this.audio.addEventListener('error', () => {
            this._playerState.set('stopped');
            console.error('Audio playback error');
        });
    }

    setPlaylist(tracks: Track[]): void {
        this._playlist.set([...tracks]);
    }

    loadTrack(track: Track): void {
        this._playerState.set('buffering');
        const url = this.trackService.getAudioUrl(track);

        this.audio.src = url;
        this._currentTrack.set(track);
        this._currentTime.set(0);
    }

    async play(track?: Track): Promise<void> {
        if (track && track.id !== this._currentTrack()?.id) {
            this.loadTrack(track);
        }

        if (this.audio.src) {
            await this.audio.play();
        }
    }

    pause(): void {
        this.audio.pause();
    }

    stop(): void {
        this.audio.pause();
        this.audio.currentTime = 0;
        this._playerState.set('stopped');
        this._currentTime.set(0);
    }

    async next(): Promise<void> {
        const list = this._playlist();
        const current = this._currentTrack();

        if (list.length === 0) return;

        let nextIndex = 0;
        if (current) {
            const currentIndex = list.findIndex((t) => t.id === current.id);
            nextIndex = (currentIndex + 1) % list.length;
        }

        await this.play(list[nextIndex]);
    }

    async previous(): Promise<void> {
        const list = this._playlist();
        const current = this._currentTrack();

        if (list.length === 0) return;

        // If more than 3 seconds in, restart current track
        if (this._currentTime() > 3) {
            this.seek(0);
            return;
        }

        let prevIndex = list.length - 1;
        if (current) {
            const currentIndex = list.findIndex((t) => t.id === current.id);
            prevIndex = currentIndex > 0 ? currentIndex - 1 : list.length - 1;
        }

        await this.play(list[prevIndex]);
    }

    seek(time: number): void {
        if (this.audio.src) {
            this.audio.currentTime = Math.max(0, Math.min(time, this._duration()));
        }
    }

    seekPercent(percent: number): void {
        const time = (percent / 100) * this._duration();
        this.seek(time);
    }

    setVolume(value: number): void {
        const volume = Math.max(0, Math.min(1, value));
        this._volume.set(volume);
        this.audio.volume = volume;
    }

    formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
