import { Component, OnInit } from '@angular/core';
import { Student } from '../../model/Student';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../service/student.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapPickerComponent } from '../../map-picker/map-picker.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MapPickerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  studentDetails: Student | null = null;
  isLoading = false;
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit() {
    this.loadStudentDetails();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      pickupLocation: this.fb.group({
        latitude: [null, Validators.required],
        longitude: [null, Validators.required]
      }),
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private loadStudentDetails() {
    this.isLoading = true;
    const studentId = localStorage.getItem('studentId');
    
    if (studentId) {
      this.studentService.getStudentById(Number(studentId)).subscribe(
        (student: Student) => {
          this.studentDetails = student;
          this.updateForm(student);
          this.isLoading = false;
        },
        error => {
          console.error('Error loading student details:', error);
          this.isLoading = false;
          this.showErrorMessage('Failed to load profile details');
        }
      );
    }
  }

  private updateForm(student: Student) {
    this.profileForm.patchValue({
      name: student.name,
      email: student.email,
      phone: student.phoneNumber,
      pickupLocation: {
        latitude: student.pickupLocation?.latitude,
        longitude: student.pickupLocation?.longitude
      }
    });
  }

  onLocationChange(location: { lat: number; lng: number }) {
    this.profileForm.patchValue({
      pickupLocation: {
        latitude: location.lat,
        longitude: location.lng
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Implement file upload logic here
      // You might want to create a separate service for handling file uploads
      console.log('File selected:', file);
    }
  }

  triggerFileInput() {
    // Implement file input trigger
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  resetForm() {
    if (this.studentDetails) {
      this.updateForm(this.studentDetails);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formData = this.profileForm.value;
      
      // Only include password if it's being changed
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        pickupLocation: formData.pickupLocation
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      this.studentService.updateStudent(this.studentDetails!.id, updateData).subscribe(
        (updatedStudent: Student) => {
          this.studentDetails = updatedStudent;
          this.showSuccessMessage('Profile updated successfully');
          this.isLoading = false;
        },
        error => {
          console.error('Error updating profile:', error);
          this.showErrorMessage(error.error?.message || 'Failed to update profile');
          this.isLoading = false;
        }
      );
    }
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
