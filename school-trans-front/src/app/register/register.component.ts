import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = {
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    pickupLocation: ''
  };
  
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const user = { username: this.registerForm.username, email: this.registerForm.email, password: this.registerForm.password };
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

  goTologin() {
    this.router.navigate(['/login']);
    }
}
