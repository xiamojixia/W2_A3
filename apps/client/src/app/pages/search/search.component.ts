import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <h2>搜索页</h2>
      <input type="text" placeholder="搜索..." [(ngModel)]="searchQuery">
      <button (click)="onSearch()">搜索</button>
      <div *ngIf="searchResults">
        <h3>搜索结果:</h3>
        <ul>
          <li *ngFor="let result of searchResults">{{ result }}</li>
        </ul>
      </div>
    </div>
  `,
  standalone: false,
  styles: [`
    .search-container {
      padding: 20px;
    }
  `]
})
export class SearchComponent {
  searchQuery = '';
  searchResults: string[] = [];

  onSearch(): void {
    // 模拟搜索逻辑
    this.searchResults = [
      `结果1: ${this.searchQuery}`,
      `结果2: ${this.searchQuery}`,
      `结果3: ${this.searchQuery}`
    ];
  }
}
