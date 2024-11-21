import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';  // Import CommonModule
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { Student } from '../model/Student';

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
  
          // Save the JWT token to localStorage
          localStorage.setItem('token', response.token);  
  
          // After login, fetch all students and then find the one that matches the username
          this.fetchAllStudents(response.token);
  
          this.router.navigate(['/dashboard']);  // Navigate to the dashboard after successful login
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = error.error.error || 'Invalid username or password';
        }
      );
  }
  
  // Fetch all students using the token and filter by username
  fetchAllStudents(token: string) {
    this.http.get<any[]>('http://localhost:8080/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe(
      (students: Student[]) => {  // Specify that the response will be an array of students
        console.log('All students fetched:', students);
  
        // Find the student with the matching username
        const loggedInStudent = students.find(student => student.username === this.username);
  
        if (loggedInStudent) {
          console.log('Found student:', loggedInStudent);
          // Save the student ID and any other details to localStorage
          localStorage.setItem('studentId', loggedInStudent.id.toString());  // Ensure ID is a string
        } else {
          console.error('Student not found');
        }
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
  

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
