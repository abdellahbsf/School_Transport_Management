import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../service/student.service';
import { Student } from '../model/Student';
import { MapPickerComponent } from '../map-picker/map-picker.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MapPickerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  studentDetails: Student | null = null;  // Holds the logged-in student details
  studentLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };  // Holds student's current location

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentDetails();  // Fetch student details when component loads
  }

  // Load student details based on the logged-in student's ID
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

  private setStudentLocation(student: Student): void {
    if (student.pickupLocation?.latitude && student.pickupLocation?.longitude) {
      this.studentLocation = {
        lat: student.pickupLocation.latitude,
        lng: student.pickupLocation.longitude,
      };
    } else {
      // Default to fallback location
      this.studentLocation = { lat: 40.73061, lng: -73.935242 }; // New York coordinates
    }
  }

  // Get the student ID from local storage and convert to number
  private getLoggedInStudentId(): number | null {
    const studentId = localStorage.getItem('studentId');  // Get the stored studentId from localStorage
    return studentId ? parseInt(studentId, 10) : null;  // Convert to number or return null if not found
  }

  // Logout method (clear session or token)
  logout(): void {
    localStorage.removeItem('studentId');  // Clear the student ID from local storage
    this.router.navigate(['/login']);  // Redirect to login page
  }

  editProfile(): void {
    // Navigate to edit profile page
    this.router.navigate(['/profile/edit']);
  }

  trackBus(): void {
    // Navigate to track bus page
    this.router.navigate(['/track-bus']);
  }

  viewAllNotifications(): void {
    // Navigate to notifications page
    this.router.navigate(['/notifications']);
  }

  viewFullSchedule(): void {
    // Navigate to full schedule page
    this.router.navigate(['/schedule']);
  }
}
