import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryDTO } from '../models/track.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private api = inject(ApiService);

    getAllCategories(): Observable<CategoryDTO[]> {
        return this.api.get<CategoryDTO[]>('/categories');
    }

    getCategory(id: string): Observable<CategoryDTO> {
        return this.api.get<CategoryDTO>(`/categories/${id}`);
    }
}
