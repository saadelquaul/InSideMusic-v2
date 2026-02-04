import { createAction, props } from '@ngrx/store';
import { Track, TrackFormData } from '../../core/models/track.model';

// Load tracks
export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction(
    '[Track] Load Tracks Success',
    props<{ tracks: Track[] }>()
);
export const loadTracksFailure = createAction(
    '[Track] Load Tracks Failure',
    props<{ error: string }>()
);

// Add track
export const addTrack = createAction(
    '[Track] Add Track',
    props<{ formData: TrackFormData }>()
);
export const addTrackSuccess = createAction(
    '[Track] Add Track Success',
    props<{ track: Track }>()
);
export const addTrackFailure = createAction(
    '[Track] Add Track Failure',
    props<{ error: string }>()
);

// Update track
export const updateTrack = createAction(
    '[Track] Update Track',
    props<{ id: string; formData: Partial<TrackFormData> }>()
);
export const updateTrackSuccess = createAction(
    '[Track] Update Track Success',
    props<{ track: Track }>()
);
export const updateTrackFailure = createAction(
    '[Track] Update Track Failure',
    props<{ error: string }>()
);

// Delete track
export const deleteTrack = createAction(
    '[Track] Delete Track',
    props<{ id: string }>()
);
export const deleteTrackSuccess = createAction(
    '[Track] Delete Track Success',
    props<{ id: string }>()
);
export const deleteTrackFailure = createAction(
    '[Track] Delete Track Failure',
    props<{ error: string }>()
);

// Select track
export const selectTrack = createAction(
    '[Track] Select Track',
    props<{ id: string | null }>()
);

// Clear error
export const clearTrackError = createAction('[Track] Clear Error');
