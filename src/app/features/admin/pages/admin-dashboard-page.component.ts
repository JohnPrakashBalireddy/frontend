import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { AdminApiService } from '../../../api/admin-api.service';
import { AdminStats } from '../../../core/models/domain.model';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
  standalone: false
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);

  readonly stats = signal<AdminStats>({
    activeRequirements: 0,
    offersToday: 0,
    dealsThisWeek: 0,
    verifiedShops: 0
  });

  readonly selectedRange = signal<'day' | 'month' | 'year'>('day');
  readonly pendingShops = signal<User[]>([]);
  readonly error = signal('');

  readonly chartData = computed(() => {
    const stats = this.stats();
    const range = this.selectedRange();

    return [
      {
        label: 'Active requirements',
        value: range === 'year' ? Math.round(stats.activeRequirements * 1.5) : range === 'month' ? Math.round(stats.activeRequirements * 1.2) : stats.activeRequirements
      },
      {
        label: 'Offers',
        value: range === 'year' ? stats.offersToday * 260 : range === 'month' ? stats.offersToday * 22 : stats.offersToday
      },
      {
        label: 'Deals',
        value: range === 'year' ? stats.dealsThisWeek * 52 : range === 'month' ? stats.dealsThisWeek * 4 : Math.round(stats.dealsThisWeek / 7)
      },
      {
        label: 'Verified shops',
        value: range === 'year' ? stats.verifiedShops * 12 : stats.verifiedShops
      }
    ];
  });

  readonly maxChartValue = computed(() => Math.max(...this.chartData().map((item) => item.value), 1));

  ngOnInit(): void {
    this.loadAll();
  }

  approve(vendorId: string | number): void {
    this.adminApi.approveVendor(vendorId).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => {
        console.error('Error approving vendor:', err);
        this.error.set('Failed to approve vendor');
      }
    });
  }

  reject(vendorId: string | number): void {
    this.adminApi.rejectVendor(vendorId).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => {
        console.error('Error rejecting vendor:', err);
        this.error.set('Failed to reject vendor');
      }
    });
  }

  private loadAll(): void {
    this.error.set('');
    
    this.adminApi.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.error.set('Failed to load dashboard stats');
      }
    });

    this.adminApi.listPendingApprovals().subscribe({
      next: (shops) => {
        console.log('Pending approvals loaded:', shops);
        this.pendingShops.set(shops);
      },
      error: (err) => {
        console.error('Error loading pending approvals:', err);
        this.error.set('Failed to load pending approvals');
      }
    });
  }
}
