import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;

  constructor(private router: Router) {}

  // 登录方法
  login(username: string, password: string): boolean {
    // 这里应该是实际的登录逻辑
    if (username && password) {
      this.isAuthenticated = true;
      // 可以在这里存储token或用户信息
      localStorage.setItem('token', 'your-auth-token');
      return true;
    }
    return false;
  }

  // 登出方法
  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    // 检查本地存储中是否有token
    const token = localStorage.getItem('token');
    return !!token || this.isAuthenticated;
  }
}
