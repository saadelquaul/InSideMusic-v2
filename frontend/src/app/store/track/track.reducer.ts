import { createReducer, on } from '@ngrx/store';
import { Track, LoadingState } from '../../core/models/track.model';
import * as TrackActions from './track.actions';

export interface TrackState {
    tracks: Track[];
    selectedTrackId: string | null;
    loadingState: LoadingState;
    error: string | null;
}

export const initialState: TrackState = {
    tracks: [],
    selectedTrackId: null,
    loadingState: 'idle',
    error: null,
};

export const trackReducer = createReducer(
    initialState,

    // Load tracks
    on(TrackActions.loadTracks, (state) => ({
        ...state,
        loadingState: 'loading' as LoadingState,
        error: null,
    })),
    on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({
        ...state,
        tracks,
        loadingState: 'success' as LoadingState,
    })),
    on(TrackActions.loadTracksFailure, (state, { error }) => ({
        ...state,
        loadingState: 'error' as LoadingState,
        error,
    })),

    // Add track
    on(TrackActions.addTrack, (state) => ({
        ...state,
        loadingState: 'loading' as LoadingState,
        error: null,
    })),
    on(TrackActions.addTrackSuccess, (state, { track }) => ({
        ...state,
        tracks: [...state.tracks, track],
        loadingState: 'success' as LoadingState,
    })),
    on(TrackActions.addTrackFailure, (state, { error }) => ({
        ...state,
        loadingState: 'error' as LoadingState,
        error,
    })),

    // Update track
    on(TrackActions.updateTrack, (state) => ({
        ...state,
        loadingState: 'loading' as LoadingState,
        error: null,
    })),
    on(TrackActions.updateTrackSuccess, (state, { track }) => ({
        ...state,
        tracks: state.tracks.map((t) => (t.id === track.id ? track : t)),
        loadingState: 'success' as LoadingState,
    })),
    on(TrackActions.updateTrackFailure, (state, { error }) => ({
        ...state,
        loadingState: 'error' as LoadingState,
        error,
    })),

    // Delete track
    on(TrackActions.deleteTrack, (state) => ({
        ...state,
        loadingState: 'loading' as LoadingState,
        error: null,
    })),
    on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
        ...state,
        tracks: state.tracks.filter((t) => t.id !== id),
        selectedTrackId: state.selectedTrackId === id ? null : state.selectedTrackId,
        loadingState: 'success' as LoadingState,
    })),
    on(TrackActions.deleteTrackFailure, (state, { error }) => ({
        ...state,
        loadingState: 'error' as LoadingState,
        error,
    })),

    // Select track
    on(TrackActions.selectTrack, (state, { id }) => ({
        ...state,
        selectedTrackId: id,
    })),

    // Clear error
    on(TrackActions.clearTrackError, (state) => ({
        ...state,
        error: null,
    }))
);
