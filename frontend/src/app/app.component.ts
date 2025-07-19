import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Portal Platform';
  currentUser: any = null;

  modules = [
    {
      name: 'Master Data Mgmt',
      icon: 'spring-boot',
      route: '/master-data',
      description: 'Manage master data and configurations'
    },
    {
      name: 'Dashboards',
      icon: 'grafana',
      route: '/dashboards',
      description: 'View analytics and monitoring dashboards'
    },
    {
      name: 'Reporting',
      icon: 'birt',
      route: '/reporting',
      description: 'Generate and view reports'
    },
    {
      name: 'Log Management',
      icon: 'spring-boot',
      route: '/log-management',
      description: 'Monitor and manage application logs'
    },
    {
      name: 'Ticketing',
      icon: 'mantis',
      route: '/ticketing',
      description: 'Manage incidents, outages, and change requests'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize user session
    this.loadUserSession();
  }

  loadUserSession() {
    // Mock user session - replace with actual authentication service
    this.currentUser = {
      name: 'John Doe',
      role: 'Admin',
      avatar: 'assets/images/user-avatar.png'
    };
  }

  navigateToModule(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    // Implement logout logic
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
