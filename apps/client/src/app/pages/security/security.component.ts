import { Component } from '@angular/core';

@Component({
  selector: 'app-security',
  template: `
    <div class="security-container">
      <h2>安全页</h2>
      <div class="security-settings">
        <h3>安全设置</h3>
        <div class="setting-item">
          <label>修改密码:</label>
          <input type="password" placeholder="新密码">
          <button>更新密码</button>
        </div>
        <div class="setting-item">
          <label>两步验证:</label>
          <button>启用</button>
        </div>
        <div class="setting-item">
          <label>登录设备管理:</label>
          <button>查看</button>
        </div>
      </div>
    </div>
  `,
  standalone: false,
  styles: [`
    .security-container {
      padding: 20px;
    }
    .setting-item {
      margin: 15px 0;
    }
    .setting-item label {
      display: inline-block;
      width: 150px;
    }
  `]
})
export class SecurityComponent {}
