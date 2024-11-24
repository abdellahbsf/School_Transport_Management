// schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Schedule {
  id: number;
  routeName: string;
  busId: string;
  startTime: string;
  endTime: string;
  stops: RouteStop[];
  daysActive: string[];
  status: 'active' | 'inactive';
}

export interface RouteStop {
  id: number;
  name: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = '/api/schedules';
  private schedulesSubject = new BehaviorSubject<Schedule[]>([]);
  schedules$ = this.schedulesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSchedules();
  }

  private loadSchedules(): void {
    this.http.get<Schedule[]>(this.apiUrl)
      .subscribe(schedules => this.schedulesSubject.next(schedules));
  }

  getSchedules(): Observable<Schedule[]> {
    return this.schedules$;
  }

  getScheduleById(id: number): Observable<Schedule | undefined> {
    return this.schedules$.pipe(
      map(schedules => schedules.find(schedule => schedule.id === id))
    );
  }

  createSchedule(schedule: Omit<Schedule, 'id'>): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, schedule).pipe(
      map(newSchedule => {
        const currentSchedules = this.schedulesSubject.value;
        this.schedulesSubject.next([...currentSchedules, newSchedule]);
        return newSchedule;
      })
    );
  }

  updateSchedule(id: number, updates: Partial<Schedule>): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${id}`, updates).pipe(
      map(updatedSchedule => {
        const currentSchedules = this.schedulesSubject.value;
        const index = currentSchedules.findIndex(s => s.id === id);
        if (index !== -1) {
          currentSchedules[index] = updatedSchedule;
          this.schedulesSubject.next([...currentSchedules]);
        }
        return updatedSchedule;
      })
    );
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        const currentSchedules = this.schedulesSubject.value;
        this.schedulesSubject.next(
          currentSchedules.filter(schedule => schedule.id !== id)
        );
      })
    );
  }

  checkConflicts(schedule: Partial<Schedule>): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-conflicts`, schedule);
  }
}