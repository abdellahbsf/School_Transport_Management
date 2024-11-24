// services/bus-tracking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export interface BusLocation {
  busId: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  lastUpdate: Date;
  routeId: number;
  status: 'ON_ROUTE' | 'DELAYED' | 'STOPPED' | 'OFF_ROUTE';
  estimatedArrival: Date;
}

export interface RouteStop {
  stopId: number;
  name: string;
  latitude: number;
  longitude: number;
  estimatedArrival: Date;
  sequence: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusTrackingService {
  private apiUrl = 'http://localhost:8080/api';
  private busLocation = new BehaviorSubject<BusLocation | null>(null);
  private refreshInterval = 10000; // 10 seconds

  constructor(private http: HttpClient) {}

  // Start real-time tracking for a specific bus
  startTracking(busId: number): Observable<BusLocation> {
    return interval(this.refreshInterval).pipe(
      switchMap(() => this.getBusLocation(busId)),
      tap(location => this.busLocation.next(location))
    );
  }

  // Get current bus location
  getBusLocation(busId: number): Observable<BusLocation> {
    return this.http.get<BusLocation>(`${this.apiUrl}/buses/${busId}/location`);
  }

  // Get route stops with estimated arrival times
  getRouteStops(routeId: number): Observable<RouteStop[]> {
    return this.http.get<RouteStop[]>(`${this.apiUrl}/routes/${routeId}/stops`);
  }

  // Get estimated arrival time for student's stop
  getEstimatedArrival(busId: number, stopId: number): Observable<Date> {
    return this.http.get<{ estimatedArrival: string }>(
      `${this.apiUrl}/buses/${busId}/stops/${stopId}/eta`
    ).pipe(
      map(response => new Date(response.estimatedArrival))
    );
  }

  // Calculate if bus is delayed
  isDelayed(busLocation: BusLocation): boolean {
    return busLocation.status === 'DELAYED';
  }

  // Get current bus status with location updates
  getCurrentBusStatus(): Observable<BusLocation | null> {
    return this.busLocation.asObservable();
  }
}