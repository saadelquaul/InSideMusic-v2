import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Track, TrackFormData } from '../models/track.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class TrackService {
    private api = inject(ApiService);

    getAllTracks(): Observable<Track[]> {
        return this.api.get<Track[]>('/tracks');
    }

    getTrack(id: string): Observable<Track> {
        return this.api.get<Track>(`/tracks/${id}`);
    }

    searchTracks(query: string): Observable<Track[]> {
        return this.api.get<Track[]>('/tracks', { search: query });
    }

    getTracksByCategory(categoryId: string): Observable<Track[]> {
        return this.api.get<Track[]>('/tracks', { categoryId });
    }

    createTrack(formData: TrackFormData): Observable<Track> {
        const data = this.buildFormData(formData);
        return this.api.postFormData<Track>('/tracks', data);
    }

    updateTrack(id: string, formData: Partial<TrackFormData>): Observable<Track> {
        const data = this.buildFormData(formData);
        return this.api.putFormData<Track>(`/tracks/${id}`, data);
    }

    deleteTrack(id: string): Observable<void> {
        return this.api.delete<void>(`/tracks/${id}`);
    }

    getAudioUrl(track: Track): string {
        return track.audioUrl || this.api.getAudioUrl(track.id);
    }

    private buildFormData(formData: Partial<TrackFormData>): FormData {
        const data = new FormData();

        if (formData.title) data.append('title', formData.title);
        if (formData.artist) data.append('artist', formData.artist);
        if (formData.description) data.append('description', formData.description);
        if (formData.categoryId) data.append('categoryId', formData.categoryId);
        if (formData.audioFile) data.append('audioFile', formData.audioFile);

        return data;
    }
}
