// services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(
    private router: Router,
    private location: Location
  ) {}

  navigateTo(path: string, params?: any): void {
    this.router.navigate([path], { queryParams: params });
  }

  goBack(): void {
    this.location.back();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToTrackBus(): void {
    this.router.navigate(['/track-bus']);
  }

  navigateToSchedule(): void {
    this.router.navigate(['/schedule']);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
  }
}