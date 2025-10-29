import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,  // 导入主模块，而不是重复声明组件
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}  // 确保这个类名正确
