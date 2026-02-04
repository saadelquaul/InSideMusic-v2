import { Routes } from '@angular/router';

export const trackDetailRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./track-detail').then((m) => m.TrackDetailComponent),
    },
];
