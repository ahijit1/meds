import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Generic HTTP methods
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  // Master Data Management APIs
  getMasterData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master-data`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getMasterDataById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/master-data/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  createMasterData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/master-data`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTicket(id: number, ticket: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ticketing/${id}`, ticket, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  closeTicket(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ticketing/${id}/close`, {}, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Authentication APIs
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  validateToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/validate`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Health Check
  getHealthStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}MasterData(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/master-data/${id}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMasterData(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/master-data/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Dashboard APIs
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/metrics`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Reporting APIs
  getReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reporting`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  generateReport(reportType: string, parameters: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reporting/generate`, {
      reportType,
      parameters
    }, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  downloadReport(reportId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reporting/download/${reportId}`, {
      responseType: 'blob'
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Log Management APIs
  getLogs(filters?: any): Observable<any> {
    let url = `${this.baseUrl}/log-management`;
    if (filters) {
      const params = new URLSearchParams(filters).toString();
      url += `?${params}`;
    }
    
    return this.http.get(url)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getLogDetails(logId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/log-management/${logId}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Ticketing APIs
  getTickets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ticketing`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getTicketById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ticketing/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ticketing`, ticket, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  update
