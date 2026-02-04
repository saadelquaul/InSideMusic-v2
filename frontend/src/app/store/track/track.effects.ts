import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { TrackService } from '../../core/services/track.service';
import * as TrackActions from './track.actions';

@Injectable()
export class TrackEffects {
    private actions$ = inject(Actions);
    private trackService = inject(TrackService);

    loadTracks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.loadTracks),
            exhaustMap(() =>
                this.trackService.getAllTracks().pipe(
                    map((tracks) => TrackActions.loadTracksSuccess({ tracks })),
                    catchError((error) =>
                        of(TrackActions.loadTracksFailure({ error: error.message || 'Failed to load tracks' }))
                    )
                )
            )
        )
    );

    addTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.addTrack),
            exhaustMap(({ formData }) =>
                this.trackService.createTrack(formData).pipe(
                    map((track) => TrackActions.addTrackSuccess({ track })),
                    catchError((error) =>
                        of(TrackActions.addTrackFailure({ error: error.message || 'Failed to add track' }))
                    )
                )
            )
        )
    );

    updateTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.updateTrack),
            exhaustMap(({ id, formData }) =>
                this.trackService.updateTrack(id, formData).pipe(
                    map((track) => TrackActions.updateTrackSuccess({ track })),
                    catchError((error) =>
                        of(TrackActions.updateTrackFailure({ error: error.message || 'Failed to update track' }))
                    )
                )
            )
        )
    );

    deleteTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.deleteTrack),
            exhaustMap(({ id }) =>
                this.trackService.deleteTrack(id).pipe(
                    map(() => TrackActions.deleteTrackSuccess({ id })),
                    catchError((error) =>
                        of(TrackActions.deleteTrackFailure({ error: error.message || 'Failed to delete track' }))
                    )
                )
            )
        )
    );
}
