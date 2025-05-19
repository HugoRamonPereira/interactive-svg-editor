import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { EditorComponent } from './pages/editor/editor.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'editor', component: EditorComponent, data: { title: 'Editor' } },
      { path: 'pricing', component: PricingComponent, data: { title: 'Pricing' } },
    ],
  },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' } },
];
