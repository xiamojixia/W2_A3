import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();

    console.log('🔐 AuthGuard 检查:');
    console.log('   - 登录状态:', isLoggedIn);
    console.log('   - 当前用户:', currentUser);
    console.log('   - 平台:', isPlatformBrowser(this.platformId) ? '浏览器' : '服务器');

    if (isLoggedIn) {
      console.log('✅ AuthGuard: 允许访问');
      return true;
    } else {
      console.log('❌ AuthGuard: 拒绝访问，重定向到登录页');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
