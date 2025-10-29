import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface UserProfile {
  username: string;
  email: string;
  registrationDate: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  userProfile: UserProfile = {
    username: '示例用户',
    email: 'user@example.com',
    registrationDate: '2023-01-01',
    phone: '+86 138 0013 8000',
    bio: '热爱公益事业，积极参与各类慈善活动，希望通过自己的努力为社会带来积极的改变。',
    avatar: 'https://via.placeholder.com/150x150?text=User'
  };

  isEditing: boolean = false;
  editedProfile: UserProfile = { ...this.userProfile };

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 这里可以加载真实的用户数据
    this.loadUserProfile();
  }

  ngAfterViewInit(): void {
    // 初始化爱心拖尾效果
    setTimeout(() => {
      this.initHeartTrail();
    }, 1000);
  }

  loadUserProfile(): void {
    // 模拟从 API 加载用户数据
    // 在实际应用中，这里应该调用你的用户 API
    console.log('加载用户个人信息...');
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedProfile = { ...this.userProfile };
    }
  }

  saveProfile(): void {
    this.userProfile = { ...this.editedProfile };
    this.isEditing = false;
    // 在实际应用中，这里应该调用 API 保存数据
    console.log('保存用户信息:', this.userProfile);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedProfile = { ...this.userProfile };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 爱心拖尾效果
  private initHeartTrail(): void {
    const trailContainer = document.getElementById('trailContainer');
    if (!trailContainer) return;

    const heartCount = 8;
    const hearts: any[] = [];
    let currentHeart = 0;

    // 预创建爱心元素
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.className = 'trail-heart';

      // 随机分配大小和颜色
      const sizes = ['small', 'medium', 'large'];
      const colors = ['gold', 'pink', 'white', 'green'];

      heart.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
      heart.classList.add(colors[Math.floor(Math.random() * colors.length)]);

      trailContainer.appendChild(heart);
      hearts.push({
        element: heart,
        x: 0,
        y: 0
      });
    }

    // 添加鼠标事件监听器
    document.addEventListener('mousemove', (e) => {
      if (hearts.length === 0) return;

      const heart = hearts[currentHeart];
      const heartElement = heart.element;

      // 更新位置
      heart.x = e.clientX;
      heart.y = e.clientY;

      // 应用位置
      heartElement.style.left = heart.x + 'px';
      heartElement.style.top = heart.y + 'px';

      // 重置动画
      heartElement.style.animation = 'none';
      void heartElement.offsetWidth;
      heartElement.style.animation = '';

      // 移动到下一个爱心
      currentHeart = (currentHeart + 1) % heartCount;
    });
  }
}
