import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 导入页面组件
import { LoginComponent } from '../app/pages/login/login.component';
import { HomeComponent } from '../app/pages/home/home.component';
import { SearchComponent } from '../app/pages/search/search.component';
import { ProfileComponent } from '../app/pages/profile/profile.component';
import { SecurityComponent } from '../app/pages/security/security.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';

const routes: Routes = [
  // 默认路由重定向到主页
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // 登录页（现在是一个普通页面，不需要特殊处理）
  { path: 'login', component: LoginComponent },

  // 主页（不需要认证）
  { path: 'home', component: HomeComponent },

  // 搜索页（不需要认证）
  { path: 'search', component: SearchComponent },

  // 个人页（不需要认证）
  { path: 'profile', component: ProfileComponent },

  // 安全页（不需要认证）
  { path: 'security', component: SecurityComponent },

  // 活动详情页（不需要认证）
  { path: 'event/:id', component: EventDetailComponent },

  // 通配符路由（404页面）
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
