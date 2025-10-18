import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <h2>个人页</h2>
      <div class="profile-info">
        <p><strong>用户名:</strong> 示例用户</p>
        <p><strong>邮箱:</strong> 111</p>
        <p><strong>注册时间:</strong> 2023-01-01</p>
      </div>
    </div>
  `,
  standalone: false,
  styles: [`
    .profile-container {
      padding: 20px;
    }
    .profile-info {
      margin-top: 20px;
    }
  `]
})
export class ProfileComponent {}
