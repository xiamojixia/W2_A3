import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Event {
  id: number;
  name: string;
  description: string;
  start_datetime: string;
  location: string;
  image_url?: string;
  category_name: string;
  org_name: string;
  status: string;
  registration_count: number;
  ticket_price: number;
}

interface RegistrationData {
  event_id: number;
  registrant_name: string;
  registrant_email: string;
  registrant_phone: string;
  tickets: number;
  registered_at: string;
  comments?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private apiBaseUrl = '/api';

  registrationForm: FormGroup;
  currentEvent: Event | null = null;
  eventId: string | null = null;

  isLoading = false;
  isSubmitted = false;
  showSuccessModal = false;

  // Verification code related properties
  verificationCode: string = '';
  userEnteredCode: string = '';
  showVerificationModal: boolean = false;
  isVerificationSent: boolean = false;
  canResendVerification: boolean = true;
  countdown: number = 0;
  countdownInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      console.log('Current Event ID:', this.eventId);

      if (this.eventId) {
        this.loadEventDetails(this.eventId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      registrant_name: ['', [Validators.required, Validators.minLength(2)]],
      registrant_email: ['', [Validators.required, Validators.email]],
      registrant_phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      tickets: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      registered_at: [this.getCurrentDate(), Validators.required],
      comments: [''],
      verification_code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadEventDetails(eventId: string): void {
    this.isLoading = true;
    this.http.get<Event>(`${this.apiBaseUrl}/events/${eventId}`).subscribe({
      next: (event) => {
        this.currentEvent = event;
        this.isLoading = false;
        console.log('Event details loaded successfully:', event);
      },
      error: (error) => {
        console.error('Failed to load event details:', error);
        this.isLoading = false;
      }
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  getTotalAmount(): number {
    const quantity = this.registrationForm.get('tickets')?.value || 1;
    const price = this.currentEvent?.ticket_price || 0;
    return quantity * price;
  }

  // Check if basic information is complete (for verification code button status)
  isBasicInfoValid(): boolean {
    const name = this.registrationForm.get('registrant_name')?.value;
    const email = this.registrationForm.get('registrant_email')?.value;
    const phone = this.registrationForm.get('registrant_phone')?.value;

    return !!name && !!email && !!phone &&
           this.formControls['registrant_name'].valid &&
           this.formControls['registrant_email'].valid &&
           this.formControls['registrant_phone'].valid;
  }

  // Generate verification code
  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Get verification code
  getVerificationCode(): void {
    if (!this.isBasicInfoValid()) {
      alert('Please fill in complete and correct name, email, and phone information first');
      return;
    }

    // Generate 4-digit random verification code
    this.verificationCode = this.generateVerificationCode();
    this.isVerificationSent = true;
    this.showVerificationModal = true;
    this.canResendVerification = false;

    // Set 60-second countdown
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.canResendVerification = true;
      }
    }, 1000);

    console.log('Generated verification code:', this.verificationCode);
  }

  // Resend verification code
  resendVerificationCode(): void {
    if (this.canResendVerification) {
      this.getVerificationCode();
    }
  }

  // Close verification code popup
  closeVerificationModal(): void {
    this.showVerificationModal = false;
  }

  // Verify code
  verifyCode(): void {
    const enteredCode = this.registrationForm.get('verification_code')?.value;

    if (!enteredCode) {
      alert('Please enter verification code');
      return;
    }

    if (enteredCode !== this.verificationCode) {
      alert('Verification code error, please re-enter');
      this.registrationForm.get('verification_code')?.setValue('');
      return;
    }

    // Verification code correct, close popup
    this.showVerificationModal = false;
    alert('Verification successful! You can now submit your registration.');
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // Check if form is valid
    if (this.registrationForm.invalid || !this.currentEvent) {
      this.markFormGroupTouched();
      return;
    }

    // Check if verification code is correct
    const enteredCode = this.registrationForm.get('verification_code')?.value;
    if (!this.isVerificationSent) {
      alert('Please get verification code first');
      return;
    }

    if (enteredCode !== this.verificationCode) {
      alert('Verification code error, please re-enter');
      this.registrationForm.get('verification_code')?.setValue('');
      return;
    }

    this.isLoading = true;

    const formData: RegistrationData = {
      event_id: this.currentEvent.id,
      registrant_name: this.registrationForm.value.registrant_name,
      registrant_email: this.registrationForm.value.registrant_email,
      registrant_phone: this.registrationForm.value.registrant_phone,
      tickets: this.registrationForm.value.tickets,
      registered_at: this.registrationForm.value.registered_at,
      comments: this.registrationForm.value.comments
    };

    console.log('Submitted registration data:', formData);

    this.http.post(`${this.apiBaseUrl}/registrations`, formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Registration API response:', response);

        // Judge success based on actual API response format
        if (response && response.id) {
          console.log('✅ Registration successful, registration ID:', response.id);
          this.handleSuccess();
        } else if (response && response.success) {
          console.log('✅ Registration successful (success field)');
          this.handleSuccess();
        } else if (response && response.registrant_name) {
          console.log('✅ Registration successful (registrant_name field)');
          this.handleSuccess();
        } else {
          console.warn('❌ Registration response format abnormal:', response);
          alert('Registration failed: Server response format abnormal');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration request error:', error);
        this.handleRegistrationError(error);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formControls).forEach(key => {
      this.formControls[key].markAsTouched();
    });
  }

  private handleRegistrationError(error: any): void {
    let errorMessage = 'Registration failed, please try again';

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.status === 400) {
      errorMessage = 'Request data format error, please check input information';
    } else if (error.status === 500) {
      errorMessage = 'Server internal error, please contact administrator';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server, please check network connection';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  }

  private handleSuccess(): void {
    this.showSuccessModal = true;
    // Reset all states
    this.registrationForm.reset({
      tickets: 1,
      registered_at: this.getCurrentDate(),
      comments: ''
    });
    this.isSubmitted = false;
    this.isVerificationSent = false;
    this.verificationCode = '';
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/home']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Clean up timer when component is destroyed
  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
