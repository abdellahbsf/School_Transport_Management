import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapPickerComponent } from '../../map-picker/map-picker.component';
import { BusTrackingService, BusLocation, RouteStop } from '../../service/bus-Tracking.service';
import { Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bus-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MapPickerComponent
  ],
  templateUrl: './bus-tracking.component.html',
  styleUrl: './bus-tracking.component.scss'
})
export class BusTrackingComponent implements OnInit, OnDestroy {
  currentLocation: BusLocation | null = null;
  routeStops: RouteStop[] = [];
  defaultLat = 33.589886;
  defaultLng = -7.603869;
  private tracking$?: Subscription;

  constructor(private busTrackingService: BusTrackingService) {}

  ngOnInit() {
    // Start tracking the bus (assuming we have the busId)
    const busId = 1; // This should come from your route or service
    this.tracking$ = this.busTrackingService.startTracking(busId).subscribe(
      location => {
        this.currentLocation = location;
        this.loadRouteStops(location.routeId);
      }
    );
  }

  ngOnDestroy() {
    if (this.tracking$) {
      this.tracking$.unsubscribe();
    }
  }

  loadRouteStops(routeId: number) {
    this.busTrackingService.getRouteStops(routeId).subscribe(
      stops => this.routeStops = stops
    );
  }

  formatETA(date: Date | undefined): string {
    if (!date) return 'N/A';
    const eta = new Date(date);
    const now = new Date();
    const diff = eta.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Arriving';
    return `${minutes} min`;
  }

  formatLastUpdate(date: Date | undefined): string {
    if (!date) return 'N/A';
    const update = new Date(date);
    const now = new Date();
    const diff = now.getTime() - update.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    return `${minutes} min ago`;
  }

  isNextStop(stop: RouteStop): boolean {
    if (!this.routeStops.length || !this.currentLocation) return false;
    const nextStopIndex = this.routeStops.findIndex(s => 
      new Date(s.estimatedArrival) > new Date()
    );
    return stop.sequence === (nextStopIndex !== -1 ? this.routeStops[nextStopIndex].sequence : -1);
  }

  centerOnBus() {
    if (this.currentLocation) {
      // Implement map centering logic
    }
  }

  centerOnMyStop() {
    // Implement map centering logic for user's stop
  }
}
