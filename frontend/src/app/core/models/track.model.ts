// Category interface to match backend
export interface CategoryDTO {
    id: string;
    name: string;
    description?: string;
}

export type Category = CategoryDTO;

// Track response from API
export interface Track {
    id: string;
    title: string;
    artist: string;
    description?: string;
    duration: number;
    categoryId: string;
    categoryName: string;
    audioUrl: string;
    coverUrl?: string;
    dateAdded: string;
    updatedAt?: string;
}

// Form data for creating/updating tracks
export interface TrackFormData {
    title: string;
    artist: string;
    description?: string;
    categoryId: string;
    audioFile?: File;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type PlayerState = 'stopped' | 'playing' | 'paused' | 'buffering';
