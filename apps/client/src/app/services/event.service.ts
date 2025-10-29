import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
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
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = '/api/events';
  private fallbackImg = 'https://via.placeholder.com/800x450?text=No+Image';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getFallbackImage(): string {
    return this.fallbackImg;
  }
}
