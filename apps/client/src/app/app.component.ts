import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'my-angular-app';

  constructor(public authService: AuthService) {}
}
