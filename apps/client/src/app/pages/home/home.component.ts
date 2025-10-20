import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Event {
  id: number;
  name: string;
  description: string;
  start_datetime: string;
  location: string;
  image_url?: string;
  category_name: string;
  org_name: string;
  status: string;
  registration_count: number;
}

interface HeartElement {
  element: HTMLElement;
  x: number;
  y: number;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  featuredEvents: Event[] = [];
  allEvents: Event[] = [];

  totalEvents: number = 0;
  totalParticipants: number = 0;
  totalFunds: number = 0;

  isLoading: boolean = true;
  errorMessage: string = '';

  // 轮播图相关
  private carouselInterval: any;
  currentSlideIndex: number = 0;

  // 爱心拖尾相关
  private hearts: HeartElement[] = [];
  private heartCount: number = 12;
  private currentHeart: number = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    // 在视图初始化后启动爱心拖尾效果
    setTimeout(() => {
      this.initHeartTrail();
    }, 1000);
  }

  ngOnDestroy(): void {
    // 清理定时器
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    // 清理事件监听器
    this.removeEventListeners();
  }

  // 初始化爱心拖尾效果
  private initHeartTrail(): void {
    const trailContainer = document.getElementById('trailContainer');
    if (!trailContainer) {
      console.warn('爱心拖尾容器未找到');
      return;
    }

    // 预创建爱心元素
    for (let i = 0; i < this.heartCount; i++) {
      const heart = document.createElement('div');
      heart.className = 'trail-heart';

      // 随机分配大小和颜色
      const sizes = ['small', 'medium', 'large'];
      const colors = ['gold', 'pink', 'white', 'green'];

      heart.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
      heart.classList.add(colors[Math.floor(Math.random() * colors.length)]);

      // 随机添加跳动效果
      if (Math.random() > 0.7) {
        heart.classList.add('bounce');
      }

      trailContainer.appendChild(heart);
      this.hearts.push({
        element: heart,
        x: 0,
        y: 0
      });
    }

    // 添加事件监听器
    this.addMouseEventListeners();
  }

  // 添加鼠标事件监听器
  private addMouseEventListeners(): void {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
  }

  // 移除事件监听器
  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
    document.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
  }

  // 处理鼠标移动
  private handleMouseMove(e: MouseEvent): void {
    if (this.hearts.length === 0) return;

    const heart = this.hearts[this.currentHeart];
    const heartElement = heart.element;

    // 更新位置
    heart.x = e.clientX;
    heart.y = e.clientY;

    // 应用位置
    heartElement.style.left = heart.x + 'px';
    heartElement.style.top = heart.y + 'px';

    // 重置动画
    heartElement.style.animation = 'none';
    void heartElement.offsetWidth; // 触发重绘
    heartElement.style.animation = '';

    // 移动到下一个爱心
    this.currentHeart = (this.currentHeart + 1) % this.heartCount;
  }

  // 处理鼠标离开
  private handleMouseLeave(): void {
    this.hearts.forEach(heart => {
      heart.element.style.opacity = '0';
    });
  }

  // 处理鼠标进入
  private handleMouseEnter(): void {
    this.hearts.forEach(heart => {
      heart.element.style.opacity = '0.9';
    });
  }

  // 加载初始数据
loadInitialData(): void {
  this.isLoading = true;
  console.log('🚀 开始加载活动数据...');

  this.http.get<Event[]>('/api/events').subscribe({
    next: (events: Event[]) => {
      console.log('✅ API 响应成功，原始数据:', events);
      console.log('🔢 总活动数量:', events.length);

      if (events && events.length > 0) {
        console.log('🎯 第一个活动完整信息:', events[0]);
        console.log('🔍 活动状态字段值:', events[0].status);
        console.log('🔍 活动状态字段类型:', typeof events[0].status);
      }

      // 特色活动（轮播图）
      this.featuredEvents = events.slice(0, 4);
      console.log('🌟 特色活动数量:', this.featuredEvents.length);
      console.log('🌟 特色活动内容:', this.featuredEvents);

      // 调试活动状态过滤
      console.log('🔍 开始过滤活动状态...');
      const activeEvents = events.filter(ev => {
        const status = ev.status;
        console.log(`活动 "${ev.name}" 的状态: "${status}"`);
        const isActive = status === 'active';
        console.log(`  是否活跃: ${isActive}`);
        return isActive;
      });

      console.log('✅ 过滤后的活跃活动数量:', activeEvents.length);
      console.log('✅ 过滤后的活跃活动内容:', activeEvents);

      this.allEvents = activeEvents;
      console.log('📋 最终 allEvents 数量:', this.allEvents.length);
      console.log('📋 最终 allEvents 内容:', this.allEvents);

      this.calculateStats(events);
      this.isLoading = false;

      // 初始化轮播图
      setTimeout(() => this.setupCarousel(), 100);
    },
    error: (error) => {
      console.error('❌ API 请求失败:', error);
      this.errorMessage = 'Failed to load events';
      this.isLoading = false;
    }
  });
}

  // 设置轮播图
  setupCarousel(): void {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    const fallbackImg = 'https://via.placeholder.com/800x450?text=No+Image';

    if (this.featuredEvents.length === 0) {
      track.innerHTML = `
        <div class="carousel-slide active" style="background-image:url('${fallbackImg}')">
          <div class="carousel-caption">No Events</div>
        </div>
      `;
    } else {
      track.innerHTML = '';

      this.featuredEvents.forEach((event, idx) => {
        const url = event.image_url || fallbackImg;
        const div = document.createElement('div');
        div.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.18)), url('${url}')`;

        div.innerHTML = `
          <div class="carousel-caption">
            <h3>${event.name}</h3>
            <p>${event.category_name} · ${event.org_name}</p>
          </div>
        `;

        div.addEventListener('click', () => {
          this.viewEventDetails(event);
        });

        track.appendChild(div);
      });

      // 自动轮播
      this.startCarousel();
    }
  }

  // 开始轮播
  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      const slides = document.querySelectorAll('.carousel-slide');
      if (slides.length === 0) return;

      slides.forEach(slide => slide.classList.remove('active'));
      this.currentSlideIndex = (this.currentSlideIndex + 1) % slides.length;
      slides[this.currentSlideIndex].classList.add('active');
    }, 4000);
  }

  // 手动切换到指定幻灯片
  goToSlide(index: number): void {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    slides.forEach(slide => slide.classList.remove('active'));
    this.currentSlideIndex = index;
    slides[this.currentSlideIndex].classList.add('active');
  }

  // 计算统计数据
  calculateStats(events: Event[]): void {
    this.totalEvents = events.length;
    this.totalParticipants = events.reduce((sum, event) => sum + event.registration_count, 0);
    this.totalFunds = this.totalParticipants * 100;
  }

  // 格式化日期
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 查看活动详情
viewEventDetails(event: Event): void {
  this.router.navigate(['/event', event.id]);
}


  // 登出
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
