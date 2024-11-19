import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';  // Import CommonModule
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const user = { username: this.username, password: this.password };
    this.http.post('http://localhost:8080/api/auth/login', user)
      .subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token);  // Save the JWT token to localStorage
          this.router.navigate(['/dashboard']);  // Navigate to the dashboard after successful login
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = error.error.error || 'Invalid username or password';
        }
      );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
