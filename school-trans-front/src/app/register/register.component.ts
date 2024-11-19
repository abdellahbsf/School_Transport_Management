import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const user = { username: this.username, email: this.email, password: this.password };
    this.http.post('http://localhost:8080/api/auth/register', user)
      .subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);  // Navigate to login page on success
        },
        (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = error.error.error || 'Registration failed. Please try again.';
        }
      );
  }
}
