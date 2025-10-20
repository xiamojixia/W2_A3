import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <main [class.logged-out]="!authService.isLoggedIn()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px);
      padding: 2rem;
    }
    main.logged-out {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ecf0f1;
    }
  `]
})
export class AppComponent {
  title = 'my-angular-app';

  constructor(public authService: AuthService) {}
}
