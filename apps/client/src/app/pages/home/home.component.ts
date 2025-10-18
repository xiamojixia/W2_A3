import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h2>主页</h2>
      <p>欢迎来到主页！</p>
    </div>
  `,
  standalone: false,
  styles: [`
    .home-container {
      padding: 20px;
    }
  `]
})
export class HomeComponent {}
