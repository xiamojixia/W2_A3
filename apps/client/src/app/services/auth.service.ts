import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private currentUser: User | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  // 登录方法
  login(username: string, password: string): boolean {
    if (username && password) {
      this.isAuthenticated = true;
      const user: User = { id: 1, username, email: 'user@example.com' };
      this.currentUser = user;

      // 只在浏览器环境中使用 localStorage
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', 'your-auth-token');
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return true;
    }
    return false;
  }

  // 登出方法
  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;

    // 只在浏览器环境中使用 localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }

    this.router.navigate(['/login']);
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    // 如果在浏览器环境，检查 localStorage
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return !!token || this.isAuthenticated;
    }

    // 在服务器环境，只检查内存状态
    return this.isAuthenticated;
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // 只在浏览器环境中从 localStorage 读取
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }

    return null;
  }
}
