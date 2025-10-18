import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: false,
  //styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  currentUser: any;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
