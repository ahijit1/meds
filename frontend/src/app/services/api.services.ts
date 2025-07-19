// frontend/src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // The URL of your Node.js backend
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ticketing/tickets`);
  }

  // Add other methods for master-data, reporting, etc.
  // e.g., getMasterData(): Observable<any> { ... }
}
