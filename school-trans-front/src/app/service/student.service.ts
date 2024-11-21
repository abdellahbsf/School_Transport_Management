import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../model/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
    private apiUrl = 'http://localhost:8080/api/students';  // Base URL for API calls
  
    constructor(private http: HttpClient) {}
  
    // Get all students (GET request)
    getAllStudents(): Observable<Student[]> {
      return this.http.get<Student[]>(this.apiUrl);  // Call the GET API to retrieve all students
    }
  
    // Get student details by ID
    getStudentById(id: number): Observable<Student> {
        return this.http.get<Student>(`${this.apiUrl}/${id}`);  // API call to get student by ID
    }
  
    // Update student details (PUT request)
    updateStudent(id: number, student: Student): Observable<Student> {
      return this.http.put<Student>(`${this.apiUrl}/${id}`, student);  // Update student by ID
    }
  
    // Delete a student (DELETE request)
    deleteStudent(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);  // Delete student by ID
    }
  }
