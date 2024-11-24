import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Schedule } from '../../service/schedule.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  selectedView = signal<'day' | 'week' | 'month'>('week');
  schedules = signal<Schedule[]>([
    {
      id: 1,
      routeName: 'Morning Route A',
      busId: 'BUS-001',
      startTime: '07:30',
      endTime: '08:30',
      stops: [
        { id: 1, name: 'Stop 1', time: '07:30' },
        { id: 2, name: 'Stop 2', time: '07:45' },
        { id: 3, name: 'Stop 3', time: '08:00' },
        { id: 4, name: 'School', time: '08:30' }
      ],
      daysActive: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      status: 'active'
    }
  ]);

  timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  ngOnInit(): void {}

  updateView(view: 'day' | 'week' | 'month'): void {
    this.selectedView.set(view);
  }

  hasActiveRoute(day: string, time: string): boolean {
    return this.schedules().some(schedule => 
      schedule.startTime <= time &&
      schedule.endTime > time &&
      schedule.daysActive.includes(day) &&
      schedule.status === 'active'
    );
  }

  getStatusClass(status: string): string {
    return `status-badge ${status}`;
  }
}