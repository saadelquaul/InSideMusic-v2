import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./library').then((m) => m.LibraryComponent),
    },
];
