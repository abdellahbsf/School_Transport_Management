import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../service/student.service';
import { Student } from '../model/Student';
import { MapPickerComponent } from '../map-picker/map-picker.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationService } from '../service/navigation.service';


interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'warning' | 'urgent';
}

interface UpcomingTrip {
  id: number;
  date: Date;
  pickupTime: string;
  dropoffTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MapPickerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  studentDetails: Student | null = null;
  studentLocation = { lat: 33.589886, lng: -7.603869 };
  stats = {
    completedTrips: 42,
    upcomingTrips: 15
  };
  
  unreadNotifications: Notification[] = [];
  recentNotifications: Notification[] = [];
  upcomingTrips: UpcomingTrip[] = [];

  constructor(
    private studentService: StudentService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadStudentDetails();
    this.loadNotifications();
    this.loadUpcomingTrips();
  }

  private loadStudentDetails(): void {
    const studentId = this.getLoggedInStudentId();
    if (studentId) {
      this.studentService.getStudentById(studentId).subscribe(
        (student: Student) => {
          this.studentDetails = student;
          this.setStudentLocation(student);
        },
        (error) => {
          console.error('Error fetching student details:', error);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  private loadNotifications(): void {
    // Mock data - replace with actual API call
    this.recentNotifications = [
      {
        id: 1,
        message: 'Bus will arrive in 10 minutes',
        timestamp: new Date(),
        isRead: false,
        type: 'info'
      },
      {
        id: 2,
        message: 'Route changed due to road work',
        timestamp: new Date(),
        isRead: false,
        type: 'warning'
      }
    ];
    this.unreadNotifications = this.recentNotifications.filter(n => !n.isRead);
  }

  private loadUpcomingTrips(): void {
    // Mock data - replace with actual API call
    this.upcomingTrips = [
      {
        id: 1,
        date: new Date(),
        pickupTime: '07:30 AM',
        dropoffTime: '08:15 AM',
        status: 'scheduled'
      },
      {
        id: 2,
        date: new Date(Date.now() + 86400000),
        pickupTime: '07:30 AM',
        dropoffTime: '08:15 AM',
        status: 'scheduled'
      }
    ];
  }

  private getLoggedInStudentId(): number | null {
    const studentId = localStorage.getItem('studentId');
    return studentId ? parseInt(studentId, 10) : null;
  }

  private setStudentLocation(student: Student): void {
    if (student.pickupLocation?.latitude && student.pickupLocation?.longitude) {
      this.studentLocation = {
        lat: student.pickupLocation.latitude,
        lng: student.pickupLocation.longitude,
      };
    }
  }

  formatLocation(location: any): string {
    if (!location) return 'Not set';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  getNotificationColor(notification: Notification): string {
    switch (notification.type) {
      case 'urgent': return 'warn';
      case 'warning': return 'accent';
      default: return 'primary';
    }
  }

  getNotificationIcon(notification: Notification): string {
    switch (notification.type) {
      case 'urgent': return 'priority_high';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }

  // Update navigation methods
  editProfile(): void {
    this.navigationService.navigateToProfile();
  }

  trackBus(): void {
    this.navigationService.navigateToTrackBus();
  }

  viewAllNotifications(): void {
    this.navigationService.navigateToNotifications();
  }

  viewFullSchedule(): void {
    this.navigationService.navigateToSchedule();
  }

  logout(): void {
    localStorage.removeItem('studentId');
    this.router.navigate(['/login']);
  }
}
