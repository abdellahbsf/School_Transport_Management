import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  // You can later populate this with data from your backend
  totalStudents: number = 250;
  totalBuses: number = 15;
  totalRoutes: number = 10;
  totalDrivers: number = 12;

  constructor(private router: Router) {}

  logout(): void {
    // Clear authentication token (or any other necessary cleanup)
    localStorage.removeItem('authToken');

    // Navigate to the Login page
    this.router.navigate(['/login']);
  }

}
