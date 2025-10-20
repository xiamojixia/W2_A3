import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Event {
  id?: number;
  org_id: number;
  category_id: number;
  name: string;
  short_description?: string;
  full_description?: string;
  location?: string;
  start_datetime: string;
  end_datetime: string;
  price?: number;
  goal_amount?: number;
  current_amount?: number;
  image_url?: string;
  status?: string;
}

interface Category {
  id?: number;
  name: string;
  description?: string;
}

interface Organisation {
  id?: number;
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  logo_url?: string;
}

interface Registration {
  id?: number;
  event_id: number;
  registrant_name: string;
  registrant_email: string;
  registrant_phone?: string;
  tickets?: number;
  comments?: string;
}

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab: string = 'events';

  isEditingEvent: boolean = false;
  isEditingCategory: boolean = false;
  isEditingOrganisation: boolean = false;
  isEditingRegistration: boolean = false;

  events: Event[] = [];
  categories: Category[] = [];
  organisations: Organisation[] = [];
  registrations: Registration[] = [];

  newEvent: Event = { org_id: 0, category_id: 0, name: '', start_datetime: '', end_datetime: '' };
  newCategory: Category = { name: '' };
  newOrganisation: Organisation = { name: '' };
  newRegistration: Registration = { event_id: 0, registrant_name: '', registrant_email: '' };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loadEvents();
    this.loadCategories();
    this.loadOrganisations();
    this.loadRegistrations();
  }

  // Events
  loadEvents() {
    this.http.get<Event[]>('/api/admin/events').subscribe(data => this.events = data);
  }

  addEvent() {
    if (this.isEditingEvent) {
      this.updateEvent(this.newEvent);
    } else {
      this.http.post<Event>('/api/admin/events', this.newEvent).subscribe(() => {
        this.resetEventForm();
        this.loadEvents();
      });
    }
  }

  updateEvent(event: Event) {
  this.http.put<Event>(`/api/admin/events/${event.id}`, event).subscribe(() => {
    this.resetEventForm();
    this.loadEvents();
  });
  }

  deleteEvent(id?: number) {
    if (!id) return;
    this.http.delete(`/api/admin/events/${id}`).subscribe(() => this.loadEvents());
  }

  editEvent(e: Event) {
    this.newEvent = { ...e };
    this.isEditingEvent = true;
  }

  resetEventForm() {
  this.newEvent = { org_id: 0, category_id: 0, name: '', start_datetime: '', end_datetime: '' };
  this.isEditingEvent = false;
  }

  // Categories
  loadCategories() {
    this.http.get<Category[]>('/api/admin/categories').subscribe(data => this.categories = data);
  }

  addCategory() {
    if (this.isEditingCategory) {
      this.updateCategory(this.newCategory);
    } else {
      this.http.post<Category>('/api/admin/categories', this.newCategory).subscribe(() => {
        this.resetCategoryForm();
        this.loadCategories();
      });
    }
  }

  updateCategory(category: Category) {
  this.http.put<Category>(`/api/admin/categories/${category.id}`, category).subscribe(() => {
    this.resetCategoryForm();
    this.loadCategories();
  });
  }

  deleteCategory(id?: number) {
    if (!id) return;
    this.http.delete(`/api/admin/categories/${id}`).subscribe(() => this.loadCategories());
  }

  editCategory(c: Category) {
  this.newCategory = { ...c };
  this.isEditingCategory = true;
  }

  resetCategoryForm() {
  this.newCategory = { name: '' };
  this.isEditingCategory = false;
  }

  // Organisations
  loadOrganisations() {
    this.http.get<Organisation[]>('/api/admin/organisations').subscribe(data => this.organisations = data);
  }

  addOrganisation() {
    if (this.isEditingOrganisation) {
      this.updateOrganisation(this.newOrganisation);
    } else {
      this.http.post<Organisation>('/api/admin/organisations', this.newOrganisation).subscribe(() => {
        this.resetOrganisationForm();
        this.loadOrganisations();
      });
    }
  }

  updateOrganisation(org: Organisation) {
  this.http.put<Organisation>(`/api/admin/organisations/${org.id}`, org).subscribe(() => {
    this.resetOrganisationForm();
    this.loadOrganisations();
  });
  }

  deleteOrganisation(id?: number) {
    if (!id) return;
    this.http.delete(`/api/admin/organisations/${id}`).subscribe(() => this.loadOrganisations());
  }

  editOrganisation(o: Organisation) {
    this.newOrganisation = { ...o };
    this.isEditingOrganisation = true;
  }

  resetOrganisationForm() {
  this.newOrganisation = { name: '' };
  this.isEditingOrganisation = false;
  }

  // Registrations
  loadRegistrations() {
    this.http.get<Registration[]>('/api/admin/registrations').subscribe(data => this.registrations = data);
  }

  addRegistration() {
    if (this.isEditingRegistration) {
      this.updateRegistration(this.newRegistration);
    } else {
      this.http.post<Registration>('/api/admin/registrations', this.newRegistration).subscribe(() => {
        this.resetRegistrationForm();
        this.loadRegistrations();
      });
    }
  }

  updateRegistration(reg: Registration) {
  this.http.put<Registration>(`/api/admin/registrations/${reg.id}`, reg).subscribe(() => {
    this.resetRegistrationForm();
    this.loadRegistrations();
  });
  }

  deleteRegistration(id?: number) {
    if (!id) return;
    this.http.delete(`/api/admin/registrations/${id}`).subscribe(() => this.loadRegistrations());
  }

  editRegistration(r: Registration) {
    this.newRegistration = { ...r };
    this.isEditingRegistration = true;
  }

  resetRegistrationForm() {
  this.newRegistration = { event_id: 0, registrant_name: '', registrant_email: '' };
  this.isEditingRegistration = false;
  }
}
