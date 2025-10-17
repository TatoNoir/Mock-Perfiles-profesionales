import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData, DashboardStats, RecentUser } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Error al cargar los datos del dashboard';
        this.loading = false;
      }
    });
  }

  // Getters para facilitar el acceso a los datos en el template
  get stats(): DashboardStats | null {
    return this.dashboardData?.stats || null;
  }

  get recentUsers(): RecentUser[] {
    return this.dashboardData?.recentUsers || [];
  }
}
