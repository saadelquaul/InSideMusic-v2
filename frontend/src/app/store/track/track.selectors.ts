import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState } from './track.reducer';
import { Category } from '../../core/models/track.model';

export const selectTrackState = createFeatureSelector<TrackState>('track');

export const selectAllTracks = createSelector(
    selectTrackState,
    (state) => state.tracks
);

export const selectTrackLoadingState = createSelector(
    selectTrackState,
    (state) => state.loadingState
);

export const selectTrackError = createSelector(
    selectTrackState,
    (state) => state.error
);

export const selectSelectedTrackId = createSelector(
    selectTrackState,
    (state) => state.selectedTrackId
);

export const selectSelectedTrack = createSelector(
    selectAllTracks,
    selectSelectedTrackId,
    (tracks, id) => tracks.find((t) => t.id === id) ?? null
);

export const selectTrackById = (id: string) =>
    createSelector(selectAllTracks, (tracks) => tracks.find((t) => t.id === id));

export const selectTracksByCategory = (category: Category) =>
    createSelector(selectAllTracks, (tracks) =>
        tracks.filter((t) => t.categoryId === category.id)
    );

export const selectTracksCount = createSelector(
    selectAllTracks,
    (tracks) => tracks.length
);

export const selectIsLoading = createSelector(
    selectTrackLoadingState,
    (state) => state === 'loading'
);
