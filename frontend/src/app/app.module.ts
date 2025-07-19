// frontend/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules (if using Material Design)
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Main App Component
import { AppComponent } from './app.component';

// Feature Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportingComponent } from './components/reporting/reporting.component';
import { LogManagementComponent } from './components/log-management/log-management.component';
import { TicketingComponent } from './components/ticketing/ticketing.component';
import { MasterDataComponent } from './components/master-data/master-data.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

// Services
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { DashboardService } from './services/dashboard.service';
import { ReportingService } from './services/reporting.service';
import { TicketingService } from './services/ticketing.service';
import { LogManagementService } from './services/log-management.service';
import { MasterDataService } from './services/master-data.service';
import { UserManagementService } from './services/user-management.service';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

// Directives
import { HasPermissionDirective } from './directives/has-permission.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

// Shared Components
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    // Main App Component
    AppComponent,
    
    // Feature Components
    DashboardComponent,
    ReportingComponent,
    LogManagementComponent,
    TicketingComponent,
    MasterDataComponent,
    UserManagementComponent,
    
    // Shared Components
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    NotificationComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    
    // Pipes
    SafeHtmlPipe,
    TruncatePipe,
    TimeAgoPipe,
    
    // Directives
    HasPermissionDirective,
    ClickOutsideDirective
  ],
  imports: [
    // Angular Core Modules
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Routing
    AppRoutingModule,
    
    // Angular Material Modules
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  providers: [
    // Services
    ApiService,
    AuthService,
    DashboardService,
    ReportingService,
    TicketingService,
    LogManagementService,
    MasterDataService,
    UserManagementService,
    
    // Guards
    AuthGuard,
    RoleGuard,
    
    // HTTP Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    // Components that are dynamically created
    ConfirmDialogComponent,
    NotificationComponent
  ]
})
export class AppModule { 
  constructor() {
    console.log('Portal Platform Application Module Initialized');
  }
}

// Additional module for lazy-loaded feature modules (optional)
@NgModule({})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [
        // Singleton services that should only be imported once
        ApiService,
        AuthService
      ]
    };
  }
}
