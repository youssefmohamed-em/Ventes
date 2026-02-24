import { Component, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from "@angular/router";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [HeaderComponent, RouterModule, SidebarComponent]
})
export class LayoutComponent implements OnInit {

  lang = signal(localStorage.getItem('lang') || 'en');

  get currentDir(): string {
    return this.lang() === 'ar' ? 'rtl' : 'ltr';
  }

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.applyLang(this.lang());
  }

  applyLang(lang: string) {
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    this.lang.set(lang);
  }

  switchLang(lang: string) {
    this.applyLang(lang); // ✅ مش هنكرر الكود، كله في applyLang
  }
}