import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Event {
  id: number;
  name: string;
  description: string;
  start_datetime: string;
  location: string;
  image_url?: string;
  category_name: string;
  org_name: string;
  events_status: string;
  registration_count: number;
  max_participants?: number;
  end_datetime?: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-event-detail',
  standalone: false,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEventDetails();
  }

  loadEventDetails(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.errorMessage = 'Event ID not found';
      this.isLoading = false;
      return;
    }

    this.http.get<Event>(`/api/events/${eventId}`).subscribe({
      next: (event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.errorMessage = 'Failed to load event details';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEventImage(event: Event): string {
    return event.image_url || 'https://via.placeholder.com/800x450?text=No+Image';
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  joinEvent(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please login to join events');
      this.router.navigate(['/login']);
      return;
    }
    if (this.event) {
      alert(`You have joined: ${this.event.name}`);
    }
  }

  donateToEvent(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Please login to donate');
      this.router.navigate(['/login']);
      return;
    }
    if (this.event) {
      const amount = prompt(`Enter donation amount for ${this.event.name}:`, '50');
      if (amount) {
        alert(`Thank you for donating $${amount} to ${this.event.name}`);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
