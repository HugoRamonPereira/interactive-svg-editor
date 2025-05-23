import { Routes } from '@angular/router';
import { PricingComponent } from './pages/pricing/pricing.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'pricing', component: PricingComponent, data: { title: 'Pricing' } },
      { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } },
    ],
  },
];
