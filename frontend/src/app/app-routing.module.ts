import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components (these would be created separately)
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasterDataComponent } from './components/master-data/master-data.component';
import { ReportingComponent } from './components/reporting/reporting.component';
import { LogManagementComponent } from './components/log-management/log-management.component';
import { TicketingComponent } from './components/ticketing/ticketing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'master-data', 
    component: MasterDataComponent,
    data: { title: 'Master Data Management' }
  },
  { 
    path: 'dashboards', 
    component: DashboardComponent,
    data: { title: 'Dashboards' }
  },
  { 
    path: 'reporting', 
    component: ReportingComponent,
    data: { title: 'Reporting' }
  },
  { 
    path: 'log-management', 
    component: LogManagementComponent,
    data: { title: 'Log Management' }
  },
  { 
    path: 'ticketing', 
    component: TicketingComponent,
    data: { title: 'Ticketing System' }
  },
  // Lazy loaded modules for better performance
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
  },
  { path: '**', redirectTo: '/home' } // Wildcard route for 404 cases
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    scrollPositionRestoration: 'top',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
