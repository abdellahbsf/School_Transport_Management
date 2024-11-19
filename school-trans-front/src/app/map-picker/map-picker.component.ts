import { Component, EventEmitter, Output, OnInit  } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [],
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.scss'
})
export class MapComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const map = L.map('map').setView([51.505, -0.09], 13); // Initial map coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Listen for a click event to get the clicked coordinates
    map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Emit the selected location back to the parent component
      this.locationSelected.emit({ lat, lng });

      // Optionally, place a marker on the map where the user clicked
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`Selected Location: ${lat}, ${lng}`)
        .openPopup();
    });

    // Try to get the user's current location and center the map on it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        map.setView([lat, lon], 13); // Move map to the current location
        L.marker([lat, lon]).addTo(map)
          .bindPopup('You are here')
          .openPopup();
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}
