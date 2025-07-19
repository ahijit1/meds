import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export interface KPIMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: 'positive' | 'negative' | 'neutral';
  icon: string;
  changeIcon: string;
}

export interface ServiceStatus {
  name: string;
  version: string;
  status: 'Healthy' | 'Warning' | 'Error';
  lastCheck: Date;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: Date;
  acknowledged: boolean;
}

export interface QuickLink {
  title: string;
  description: string;
  route: string;
  icon: string;
  status: 'active' | 'inactive' | 'maintenance';
  statusText: string;
}

export interface GrafanaPanel {
  title: string;
  url: string;
  id: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  // Loading states
  isLoading = true;
  
  // Time range selection
  selectedTimeRange = '24h';
  
  // Chart data
  selectedMetric = 'cpu';
  performanceData: any[] = [];
  trafficData: any[] = [];
  performanceChart: Chart | null = null;
  trafficChart: Chart | null = null;
  
  // KPI Metrics
  kpiMetrics: KPIMetric[] = [
    {
      label: 'Total Requests',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      trend: 'neutral',
      icon: 'fas fa-globe',
      changeIcon: 'fas fa-minus'
    },
    {
      label: 'Active Users',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      trend: 'neutral',
      icon: 'fas fa-users',
      changeIcon: 'fas fa-minus'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      trend: 'positive',
      icon: 'fas fa-server',
      changeIcon: 'fas fa-arrow-up'
    },
    {
      label: 'Error Rate',
      value: '0.1%',
      change: '-0.05%',
      changeType: 'positive',
      trend: 'positive',
      icon: 'fas fa-exclamation-triangle',
      changeIcon: 'fas fa-arrow-down'
    }
  ];
  
  // Service Status
  serviceStatus: ServiceStatus[] = [
    {
      name: 'Master Data Service',
      version: '1.2.3',
      status: 'Healthy',
      lastCheck: new Date()
    },
    {
      name: 'Reporting Service',
      version: '2.1.0',
      status: 'Healthy',
      lastCheck: new Date()
    },
    {
      name: 'Log Management',
      version: '1.5.7',
      status: 'Warning',
      lastCheck: new Date()
    },
    {
      name: 'Ticketing System',
      version: '3.0.1',
      status: 'Healthy',
      lastCheck: new Date()
    },
    {
      name: 'Dashboard Service',
      version: '1.8.2',
      status: 'Healthy',
      lastCheck: new Date()
    }
  ];
  
  // Recent Alerts
  recentAlerts: Alert[] = [
    {
      id: '1',
      message: 'High memory usage detected on server node-02',
      severity: 'Warning',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      acknowledged: false
    },
    {
      id: '2',
      message: 'Database connection timeout in log management service',
      severity: 'Critical',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      acknowledged: false
    },
    {
      id: '3',
      message: 'Scheduled maintenance completed successfully',
      severity: 'Info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      acknowledged: true
    }
  ];
  
  // Quick Links
  quickLinks: QuickLink[] = [
    {
      title: 'Master Data Management',
      description: 'Manage system configuration and reference data',
      route: '/master-data',
      icon: 'fas fa-database',
      status: 'active',
      statusText: 'Online'
    },
    {
      title: 'Dashboards',
      description: 'View system metrics and performance dashboards',
      route: '/dashboard',
      icon: 'fas fa-chart-bar',
      status: 'active',
      statusText: 'Online'
    },
    {
      title: 'Reporting',
      description: 'Generate and view system reports',
      route: '/reporting',
      icon: 'fas fa-file-alt',
      status: 'active',
      statusText: 'Online'
    },
    {
      title: 'Log Management',
      description: 'Monitor and analyze system logs',
      route: '/log-management',
      icon: 'fas fa-list-alt',
      status: 'inactive',
      statusText: 'Maintenance'
    },
    {
      title: 'Ticketing',
      description: 'Manage support tickets and incidents',
      route: '/ticketing',
      icon: 'fas fa-ticket-alt',
      status: 'active',
      statusText: 'Online'
    }
  ];
  
  // Grafana Integration
  grafanaEnabled = true;
  grafanaPanels: GrafanaPanel[] = [
    {
      title: 'System Overview',
      url: 'https://grafana.example.com/d-solo/dashboard1/system-overview',
      id: 'system-overview'
    },
    {
      title: 'Application Metrics',
      url: 'https://grafana.example.com/d-solo/dashboard2/app-metrics',
      id: 'app-metrics'
    }
  ];

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
    this.startAutoRefresh();
  }

  ngAfterViewInit(): void {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Destroy charts
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    if (this.trafficChart) {
      this.trafficChart.destroy();
    }
  }

  /**
   * Initialize dashboard data
   */
  private async initializeDashboard(): Promise<void> {
    this.isLoading = true;
    
    try {
      await this.loadDashboardData();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.handleError('Failed to load dashboard data');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load all dashboard data
   */
  private async loadDashboardData(): Promise<void> {
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, these would be API calls
    this.loadKPIMetrics();
    this.loadPerformanceData();
    this.loadTrafficData();
    this.loadServiceStatus();
    this.loadRecentAlerts();
  }

  /**
   * Load KPI metrics
   */
  private loadKPIMetrics(): void {
    // Simulate real data
    this.kpiMetrics = [
      {
        label: 'Total Requests',
        value: '127.5K',
        change: '+12.5%',
        changeType: 'positive',
        trend: 'positive',
        icon: 'fas fa-globe',
        changeIcon: 'fas fa-arrow-up'
      },
      {
        label: 'Active Users',
        value: '2,847',
        change: '+8.3%',
        changeType: 'positive',
        trend: 'positive',
        icon: 'fas fa-users',
        changeIcon: 'fas fa-arrow-up'
      },
      {
        label: 'System Uptime',
        value: '99.97%',
        change: '+0.02%',
        changeType: 'positive',
        trend: 'positive',
        icon: 'fas fa-server',
        changeIcon: 'fas fa-arrow-up'
      },
      {
        label: 'Error Rate',
        value: '0.03%',
        change: '-0.07%',
        changeType: 'positive',
        trend: 'positive',
        icon: 'fas fa-exclamation-triangle',
        changeIcon: 'fas fa-arrow-down'
      }
    ];
  }

  /**
   * Load performance data for charts
   */
  private loadPerformanceData(): void {
    // Generate sample performance data
    const now = new Date();
    const dataPoints = 24; // Last 24 hours
    
    this.performanceData = Array.from({ length: dataPoints }, (_, i) => {
      const time = new Date(now.getTime() - (dataPoints - 1 - i) * 60 * 60 * 1000);
      return {
        timestamp: time,
        cpu: Math.random() * 40 + 30, // 30-70%
        memory: Math.random() * 30 + 50, // 50-80%
        disk: Math.random() * 20 + 10 // 10-30%
      };
    });
  }

  /**
   * Load traffic data
   */
  private loadTrafficData(): void {
    // Generate sample traffic data
    const now = new Date();
    const dataPoints = 24;
    
    this.trafficData = Array.from({ length: dataPoints }, (_, i) => {
      const time = new Date(now.getTime() - (dataPoints - 1 - i) * 60 * 60 * 1000);
      return {
        timestamp: time,
        requests: Math.floor(Math.random() * 1000 + 500),
        errors: Math.floor(Math.random() * 50 + 10)
      };
    });
  }

  /**
   * Load service status
   */
  private loadServiceStatus(): void {
    // Update service status with random states for demo
    this.serviceStatus = this.serviceStatus.map(service => ({
      ...service,
      lastCheck: new Date(),
      status: Math.random() > 0.8 ? 'Warning' : 'Healthy' as any
    }));
  }

  /**
   * Load recent alerts
   */
  private loadRecentAlerts(): void {
    // In real app, this would fetch from API
    this.recentAlerts = this.recentAlerts.slice(0, 5); // Show only 5 most recent
  }

  /**
   * Initialize charts
   */
  private initializeCharts(): void {
    this.initializePerformanceChart();
    this.initializeTrafficChart();
  }

  /**
   * Initialize performance chart
   */
  private initializePerformanceChart(): void {
    const canvas = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (!canvas || !this.performanceData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.performanceData.map(d => 
          d.timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        ),
        datasets: [{
          label: this.getMetricLabel(this.selectedMetric),
          data: this.performanceData.map(d => d[this.selectedMetric as keyof typeof d] as number),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.performanceChart = new Chart(ctx, config);
  }

  /**
   * Initialize traffic chart
   */
  private initializeTrafficChart(): void {
    const canvas = document.getElementById('trafficChart') as HTMLCanvasElement;
    if (!canvas || !this.trafficData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.trafficChart) {
      this.trafficChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.trafficData.map(d => 
          d.timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        ),
        datasets: [
          {
            label: 'Requests',
            data: this.trafficData.map(d => d.requests),
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderRadius: 4
          },
          {
            label: 'Errors',
            data: this.trafficData.map(d => d.errors),
            backgroundColor: 'rgba(220, 38, 38, 0.8)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.trafficChart = new Chart(ctx, config);
  }

  /**
   * Get metric label for chart
   */
  private getMetricLabel(metric: string): string {
    const labels: { [key: string]: string } = {
      'cpu': 'CPU Usage',
      'memory': 'Memory Usage',
      'disk': 'Disk Usage'
    };
    return labels[metric] || metric.toUpperCase();
  }

  /**
   * Start auto refresh
   */
  private startAutoRefresh(): void {
    // Refresh every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshDashboard();
      });
  }

  /**
   * Handle time range change
   */
  onTimeRangeChange(): void {
    this.loadPerformanceData();
    this.loadTrafficData();
    this.initializeCharts();
  }

  /**
   * Refresh dashboard
   */
  refreshDashboard(): void {
    this.loadDashboardData();
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  /**
   * Select performance metric
   */
  selectMetric(metric: string): void {
    this.selectedMetric = metric;
    this.initializePerformanceChart();
  }

  /**
   * Navigate to module
   */
  navigateToModule(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'Healthy': 'fas fa-check-circle',
      'Warning': 'fas fa-exclamation-triangle',
      'Error': 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-question-circle';
  }

  /**
   * Get alert icon
   */
  getAlertIcon(severity: string): string {
    const icons: { [key: string]: string } = {
      'Critical': 'fas fa-exclamation-triangle',
      'Warning': 'fas fa-exclamation-circle',
      'Info': 'fas fa-info-circle'
    };
    return icons[severity] || 'fas fa-bell';
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.recentAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      // In real app, this would call API to acknowledge alert
      console.log(`Alert ${alertId} acknowledged`);
    }
  }

  /**
   * View alert details
   */
  viewAlertDetails(alertId: string): void {
    // Navigate to alert details or open modal
    console.log(`Viewing details for alert ${alertId}`);
  }

  /**
   * Open Grafana
   */
  openGrafana(): void {
    window.open('https://grafana.example.com', '_blank');
  }

  /**
   * Handle errors
   */
  private handleError(message: string): void {
    // In real app, show toast notification or error modal
    console.error(message);
  }
}
