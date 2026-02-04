import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';

const DB_NAME = 'MusicStreamDB';
const DB_VERSION = 1;
const TRACKS_STORE = 'tracks';
const AUDIO_STORE = 'audioFiles';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private db: IDBDatabase | null = null;
    private dbReady: Promise<IDBDatabase>;

    constructor() {
        this.dbReady = this.initDB();
    }

    private initDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(TRACKS_STORE)) {
                    db.createObjectStore(TRACKS_STORE, { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains(AUDIO_STORE)) {
                    db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });
                }
            };
        });
    }

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        return this.dbReady;
    }

    // Track metadata operations
    async getAllTracks(): Promise<Track[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(TRACKS_STORE, 'readonly');
            const store = transaction.objectStore(TRACKS_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const tracks = request.result;
                resolve(tracks);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getTrack(id: string): Promise<Track | undefined> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(TRACKS_STORE, 'readonly');
            const store = transaction.objectStore(TRACKS_STORE);
            const request = store.get(id);

            request.onsuccess = () => {
                const track = request.result;
                resolve(track);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async saveTrack(track: Track): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(TRACKS_STORE, 'readwrite');
            const store = transaction.objectStore(TRACKS_STORE);
            const request = store.put(track);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async deleteTrack(id: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(TRACKS_STORE, 'readwrite');
            const store = transaction.objectStore(TRACKS_STORE);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Audio file operations
    async saveAudioFile(id: string, file: Blob): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(AUDIO_STORE, 'readwrite');
            const store = transaction.objectStore(AUDIO_STORE);
            const request = store.put({ id, file });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getAudioFile(id: string): Promise<Blob | undefined> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(AUDIO_STORE, 'readonly');
            const store = transaction.objectStore(AUDIO_STORE);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result?.file);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteAudioFile(id: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(AUDIO_STORE, 'readwrite');
            const store = transaction.objectStore(AUDIO_STORE);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Validation helpers
    validateFileSize(file: File, maxSizeMB: number = 10): boolean {
        return file.size <= maxSizeMB * 1024 * 1024;
    }

    validateFileFormat(file: File): boolean {
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
        return validTypes.includes(file.type);
    }
}
