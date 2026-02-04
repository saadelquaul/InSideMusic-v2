import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'library',
        pathMatch: 'full',
    },
    {
        path: 'library',
        loadChildren: () =>
            import('./features/library/library.routes').then((m) => m.libraryRoutes),
    },
    {
        path: 'track/:id',
        loadChildren: () =>
            import('./features/track-detail/track-detail.routes').then(
                (m) => m.trackDetailRoutes
            ),
    },
    {
        path: '**',
        redirectTo: 'library',
    },
];
