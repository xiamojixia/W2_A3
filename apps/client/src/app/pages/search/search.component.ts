import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../src/environments/environment';
interface Event {
  id: number;
  name: string;
  description: string;
  start_datetime: string;
  location: string;
  image_url?: string;
  category_name: string;
  org_name: string;
  events_status: string;
  registration_count: number;
}

interface Category {
  id: number;
  name: string;
}

interface HeartElement {
  element: HTMLElement;
  x: number;
  y: number;
}

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  apiUrl = environment.apiUrl;
  categories: Category[] = [];
  searchResults: Event[] = [];

  // 搜索表单数据
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  category: string = '';

  // 状态控制
  isLoading: boolean = false;
  hasSearched: boolean = false;
  errorMessage: string = '';

  // 爱心拖尾相关
  private hearts: HeartElement[] = [];
  private heartCount: number = 12;
  private currentHeart: number = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // 检查 URL 参数，如果有 eventId 则直接跳转到详情页
    this.route.queryParams.subscribe(params => {
      if (params['eventId']) {
        this.router.navigate(['/event', params['eventId']]);
      }
    });
  }

  ngAfterViewInit(): void {
    // 在视图初始化后启动爱心拖尾效果
    setTimeout(() => {
      this.initHeartTrail();
    }, 1000);
  }

  ngOnDestroy(): void {
    // 清理事件监听器
    this.removeEventListeners();
  }

  // 加载分类数据
  loadCategories(): void {
    console.log(`${this.apiUrl}`)
    this.http.get<Category[]>(`${this.apiUrl}/categories`).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories';
      }
    });
  }

  // 执行搜索
  onSearch(): void {
    if (!this.startDate && !this.endDate && !this.location && !this.category) {
      this.errorMessage = 'Please enter at least one search criteria';
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.errorMessage = '';

    let url = `${this.apiUrl}/search?`;
    const params: string[] = [];

    if (this.startDate) {
      params.push(`start_date=${encodeURIComponent(this.startDate)}`);
    }
    if (this.endDate) {
      params.push(`end_date=${encodeURIComponent(this.endDate)}`);
    }
    if (this.location) {
      params.push(`location=${encodeURIComponent(this.location)}`);
    }
    if (this.category) {
      params.push(`category_id=${encodeURIComponent(this.category)}`);
    }

    url += params.join('&');

    this.http.get<Event[]>(url).subscribe({
      next: (events) => {
        this.searchResults = events;
        this.isLoading = false;
        console.log('搜索到活动数量:', events.length);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Search failed. Please try again.';
        this.isLoading = false;
        this.searchResults = [];
      }
    });
  }

  // 清除搜索条件
  onClear(): void {
    this.startDate = '';
    this.endDate = '';
    this.location = '';
    this.category = '';
    this.searchResults = [];
    this.hasSearched = false;
    this.errorMessage = '';
  }

  // 查看活动详情 - 新增的方法
  viewEventDetails(event: Event): void {
    console.log('点击活动:', event.name, 'ID:', event.id);
    this.router.navigate(['/event', event.id]);
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

  // 获取默认图片
  getEventImage(event: Event): string {
    return event.image_url || 'https://via.placeholder.com/400x220?text=No+Image';
  }

  // 登出
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 爱心拖尾效果
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
}
