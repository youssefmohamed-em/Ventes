import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [CommonModule, RouterModule,TranslateModule]
})
export class SidebarComponent {
  constructor(private translate: TranslateService) {
  }
  // signal للغة
  currentLang = signal(localStorage.getItem('lang') || 'en');

  // إشارات للـ Sidebar
  mobileOpen = signal(false);
  collapsed = signal(false);
  isRtl = false;



  // EventEmitter للتواصل مع LayoutComponent
  @Output() langChanged = new EventEmitter<string>();

  // Toggle mobile sidebar
  toggleMobile() {
    this.mobileOpen.set(!this.mobileOpen());
  }
  
// sidebar.component.ts
getCollapseIcon() {
  if (!this.isRtl) {
    return this.collapsed() ? 'pi-chevron-right' : 'pi-chevron-left';
  } else {
    return this.collapsed() ? 'pi-chevron-left' : 'pi-chevron-right';
  }
}
  // Toggle collapsed sidebar
  toggleCollapse() {
    this.collapsed.set(!this.collapsed());
  }

  // Class لتحديد مكان Sidebar
  asidePositionClass() {
    const open = this.mobileOpen();
    return open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0';
  }

  // تغيير اللغة وإرسال الحدث للـ Layout فورًا
  toggleLanguage() {
    const newLang = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.currentLang.set(newLang);           // تحديث signal
    this.langChanged.emit(newLang);          // إرسال الحدث للـ Layout
    localStorage.setItem('lang', newLang); 
     this.isRtl = !this.isRtl; 
  }
}