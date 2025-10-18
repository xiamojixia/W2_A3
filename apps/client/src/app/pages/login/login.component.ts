import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']

})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = '请输入用户名和密码';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // 模拟 API 调用延迟
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      this.isLoading = false;

      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = '用户名或密码错误';
      }
    }, 1000);
  }
}
