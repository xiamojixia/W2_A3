import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 导入 AuthService

interface ValidationResult {
  nameExists: boolean;
  emailExists: boolean;
  phoneExists: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private apiBaseUrl = '/api';

  // 用户填写的信息
  registrant_name = '';
  registrant_email = '';
  registrant_phone = '';

  // 验证码相关
  verificationCode = '';
  confirmCode = '';

  // 状态控制
  errorMessage = '';
  isLoading = false;
  showVerificationModal = false;
  validationResult: ValidationResult = {
    nameExists: false,
    emailExists: false,
    phoneExists: false
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // 注入 AuthService
  ) {}

  ngOnInit(): void {
    this.testBackendConnection();
  }

  testBackendConnection(): void {
    this.http.get(`${this.apiBaseUrl}/health`).subscribe({
      next: (response) => console.log('✅ 后端连接正常:', response),
      error: (error) => console.error('❌ 后端连接失败:', error)
    });
  }

  // 实时检查信息是否重复
  checkInfo(): void {
    if (this.registrant_name && this.registrant_email && this.registrant_phone) {
      console.log("调用了检查信息");

      this.http.post<{success: boolean, data: ValidationResult}>(
        `/api/registrations/check-info`,
        {
          registrant_name: this.registrant_name,
          registrant_email: this.registrant_email,
          registrant_phone: this.registrant_phone
        }
      ).subscribe({
        next: (response) => {
          console.log('检查信息响应:', response);
          if (response.success) {
            this.validationResult = response.data;
          }
        },
        error: (error) => {
          console.error('检查信息错误:', error);
          this.errorMessage = '检查信息失败，请重试';
        }
      });
    }
  }

  // 获取验证码
  getVerificationCode(): void {
    if (!this.isInfoValid()) {
      this.errorMessage = '请先填写正确的信息';
      return;
    }

    // 生成4位随机验证码
    this.verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 显示弹窗
    this.showVerificationModal = true;
    this.errorMessage = '';
  }

  // 检查信息是否有效（都不重复）
  isInfoValid(): boolean {
    return !this.validationResult.nameExists &&
           !this.validationResult.emailExists &&
           !this.validationResult.phoneExists &&
           !!this.registrant_name &&
           !!this.registrant_email &&
           !!this.registrant_phone;
  }

  // 提交注册 - 关键修改部分
  onSubmit(): void {
    if (!this.registrant_name || !this.registrant_email || !this.registrant_phone) {
      this.errorMessage = '请填写完整信息';
      return;
    }

    if (!this.confirmCode) {
      this.errorMessage = '请输入验证码';
      return;
    }

    if (this.confirmCode !== this.verificationCode) {
      this.errorMessage = '验证码错误';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('发送注册请求到:', `${this.apiBaseUrl}/registrations/register-with-verification`);

    this.http.post(
      `${this.apiBaseUrl}/registrations/register-with-verification`,
      {
        registrant_name: this.registrant_name,
        registrant_email: this.registrant_email,
        registrant_phone: this.registrant_phone,
        verificationCode: this.verificationCode,
        confirmCode: this.confirmCode
      }
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('✅ 注册成功响应:', response);

        if (response.success) {
          alert('注册成功！');

          // 🔥 关键修改：注册成功后自动登录
          this.autoLoginAfterRegistration();

        } else {
          this.errorMessage = response.message || '注册失败';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ 注册错误详情:', error);
        this.handleRegistrationError(error);
      }
    });
  }

  // 注册成功后自动登录
  private autoLoginAfterRegistration(): void {
    // 使用注册信息自动登录
    // 注意：这里使用 registrant_name 作为用户名，你可以根据需要调整
    const loginSuccess = this.authService.login(this.registrant_name, 'temporary-password');

    if (loginSuccess) {
      console.log('✅ 自动登录成功');
      console.log('✅ 当前登录状态:', this.authService.isLoggedIn());
      console.log('✅ 当前用户:', this.authService.getCurrentUser());

      // 跳转到 home 页面
      this.router.navigate(['/home']).then(navigated => {
        if (navigated) {
          console.log('✅ 成功跳转到 home 页面');
        } else {
          console.error('❌ 跳转失败');
          this.errorMessage = '跳转失败，请手动刷新页面';
        }
      });
    } else {
      console.error('❌ 自动登录失败');
      this.errorMessage = '自动登录失败，请手动登录';
      // 如果自动登录失败，跳转到登录页
      this.router.navigate(['/login']);
    }
  }

  // 错误处理方法
  private handleRegistrationError(error: any): void {
    if (error.error instanceof ErrorEvent) {
      this.errorMessage = '网络错误，请检查连接';
    } else if (error.status === 200 && error.error && typeof error.error === 'string') {
      this.errorMessage = '服务器返回了错误格式的响应';
    } else if (error.status === 400) {
      this.errorMessage = error.error?.message || '请求数据格式错误';
    } else if (error.status === 500) {
      this.errorMessage = '服务器内部错误，请联系管理员';
    } else if (error.status === 0) {
      this.errorMessage = '无法连接到服务器，请确保后端正在运行';
    } else if (error.status === 404) {
      this.errorMessage = 'API接口不存在，请检查URL';
    } else {
      this.errorMessage = error.error?.message || '注册失败，请重试';
    }
  }

  // 关闭验证码弹窗
  closeModal(): void {
    this.showVerificationModal = false;
  }
}
