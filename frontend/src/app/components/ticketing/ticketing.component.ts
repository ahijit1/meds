// frontend/src/app/components/ticketing/ticketing.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Adjust path if needed

@Component({
  selector: 'app-ticketing',
  templateUrl: './ticketing.component.html',
  styleUrls: ['./ticketing.component.scss']
})
export class TicketingComponent implements OnInit {
  tickets: any[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load tickets', err);
        this.isLoading = false;
      }
    });
  }
}
