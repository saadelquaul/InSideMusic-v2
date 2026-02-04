import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    // Generic GET
    get<T>(endpoint: string, params?: Record<string, string>): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key]) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
    }

    // Generic POST
    post<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
    }

    // POST with FormData
    postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData);
    }

    // Generic PUT
    put<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
    }

    // PUT with FormData
    putFormData<T>(endpoint: string, formData: FormData): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}${endpoint}`, formData);
    }

    // Generic DELETE
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
    }

    // Get audio URL
    getAudioUrl(trackId: string): string {
        return `${this.baseUrl}/tracks/${trackId}/audio`;
    }
}
