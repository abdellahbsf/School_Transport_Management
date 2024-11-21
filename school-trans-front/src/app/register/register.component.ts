import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = {
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    pickupLocation: {
      latitude: null,
      longitude: null
    }
  };

  map: any;
  marker: any;

  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private platform: Platform) {}

  ngOnInit(): void {
    // Ensure the code only runs on the client-side
    if (this.platform.isBrowser) {
      // Dynamically import Leaflet and its CSS
      import('leaflet').then((L: any) => {
        this.initializeMap(L);
      }).catch((error: any) => {
        console.error('Error loading Leaflet:', error);
      });
    }
  }

  // Initialize the map and set pickup location on click
  initializeMap(L: any) {
    this.map = L.map('map', {
      center: L.latLng(49.2125578, 16.62662018), // Default coordinates
      zoom: 14,
    });

    // Map tile layer
    const key = 'HTEtNsiaPnMqHOWEbLNC';  // Replace with your MapTiler API key
    L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      crossOrigin: true
    }).addTo(this.map);

    // Handle map click to set pickup location
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Set marker at clicked position
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      // Update the form with the selected latitude and longitude
      this.registerForm.pickupLocation.latitude = lat;
      this.registerForm.pickupLocation.longitude = lng;
    });
  }

  // Register the user
  register() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const user = {
      username: this.registerForm.username,
      email: this.registerForm.email,
      password: this.registerForm.password,
      pickupLocation: this.registerForm.pickupLocation
    };

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

  // Navigate to login page
  goTologin() {
    this.router.navigate(['/login']);
  }
}
