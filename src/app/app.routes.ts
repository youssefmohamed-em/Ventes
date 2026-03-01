import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [

  { path:'', redirectTo:'login', pathMatch:'full'},

  {
    path:'layout',
    component: LayoutComponent,
    children:[
      { path:'', redirectTo:'dashboard', pathMatch:'full'},

      { path:'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path:'claims', loadComponent: () => import('./components/claims/claims.component').then(m => m.ClaimsComponent) },
      { path:'orders', loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
      { path:'merchant', loadComponent: () => import('./components/merchant/merchant.component').then(m => m.MerchantComponent) },

      { 
        path: 'chartDetails/:type/:color/:title/:subtitle',
        loadComponent: () => import('./shared/shared/components/chart-details/chart-details.component')
          .then(m => m.ChartDetailsComponent)
      },

      // ⛔ مهم جداً
      { path: '**', component: NotFoundComponent }
    ]
  },

  { path:'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },

  // ⛔ بره children للروت الأساسي
  { path:'**', component:NotFoundComponent }

];
