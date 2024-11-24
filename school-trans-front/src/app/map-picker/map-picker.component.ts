import { Component, OnInit, AfterViewInit, Input, EventEmitter, OnChanges, SimpleChanges, Output } from '@angular/core';
import * as L from 'leaflet';
import { BusLocation, RouteStop } from '../model/bus-tracking.model';

interface LocationChange {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [],
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.scss'
})
export class MapPickerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() lat!: number;
  @Input() lng!: number;
  @Input() isInteractive: boolean = true;
  @Input() routeStops: RouteStop[] = [];
  @Input() busLocation: BusLocation | null = null;
  @Output() locationChange = new EventEmitter<LocationChange>();

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private busMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;
  private stopMarkers: L.Marker[] = [];

  // Custom icons
  private busIcon = L.icon({
    iconUrl: 'assets/bus-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  private stopIcon = L.icon({
    iconUrl: 'assets/stop-icon.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });

  constructor() {}

  ngOnInit() {
    console.log('Initial coordinates:', { lat: this.lat, lng: this.lng });
  }

  ngAfterViewInit() {
    this.initMap();
    this.addMarker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;

    if (changes['lat'] || changes['lng']) {
      this.updateMapView();
      this.updateMarker();
    }

    if (changes['routeStops']) {
      this.updateRouteStops();
    }

    if (changes['busLocation']) {
      this.updateBusLocation();
    }
  }

  private initMap() {
    const baseMapURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    this.map = L.map('map', {
      dragging: this.isInteractive,
      touchZoom: this.isInteractive,
      doubleClickZoom: this.isInteractive,
      scrollWheelZoom: this.isInteractive,
      boxZoom: this.isInteractive,
      keyboard: this.isInteractive,
      zoomControl: this.isInteractive
    }).setView([this.lat, this.lng], 13);
    
    L.tileLayer(baseMapURL, {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add click handler if interactive
    if (this.isInteractive) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        this.updateLocation(lat, lng);
      });
    }
  }

  private addMarker() {
    if (this.lat && this.lng) {
      const marker = L.marker([this.lat, this.lng], {
        draggable: this.isInteractive
      }).addTo(this.map);

      marker.bindPopup('Selected Location').openPopup();

      if (this.isInteractive) {
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          this.updateLocation(position.lat, position.lng);
        });
      }

      this.markers.push(marker);
    }
  }

  private updateLocation(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.locationChange.emit({ lat, lng });
    this.updateMapView();
    this.updateMarker();
  }

  private updateMapView() {
    this.map?.setView([this.lat, this.lng], this.map.getZoom());
  }

  private updateMarker() {
    this.markers.forEach(marker => {
      marker.setLatLng([this.lat, this.lng]);
      this.updatePopupContent(marker);
    });
  }

  private updatePopupContent(marker: L.Marker) {
    marker.setPopupContent(
      `Location:<br>Latitude: ${this.lat.toFixed(6)}<br>Longitude: ${this.lng.toFixed(6)}`
    );
  }

  private updateRouteStops() {
    // Clear existing stop markers
    this.stopMarkers.forEach(marker => marker.remove());
    this.stopMarkers = [];

    // Add new stop markers
    this.routeStops.forEach(stop => {
      const marker = L.marker([stop.latitude, stop.longitude], {
        icon: this.stopIcon
      }).addTo(this.map);

      marker.bindPopup(`
        <strong>${stop.name}</strong><br>
        ETA: ${new Date(stop.estimatedArrival).toLocaleTimeString()}
      `);

      this.stopMarkers.push(marker);
    });

    // Update route line
    if (this.routeLine) {
      this.routeLine.remove();
    }

    if (this.routeStops.length > 1) {
      const routePoints = this.routeStops.map(stop => 
        [stop.latitude, stop.longitude] as [number, number]
      );

      this.routeLine = L.polyline(routePoints, {
        color: '#1976d2',
        weight: 3,
        opacity: 0.7
      }).addTo(this.map);
    }

    // Fit bounds to show all stops
    if (this.routeStops.length > 0) {
      const bounds = L.latLngBounds(
        this.routeStops.map(stop => [stop.latitude, stop.longitude])
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private updateBusLocation() {
    if (!this.busLocation) {
      this.busMarker?.remove();
      this.busMarker = null;
      return;
    }

    const position = [this.busLocation.latitude, this.busLocation.longitude] as [number, number];

    if (!this.busMarker) {
      this.busMarker = L.marker(position, {
        icon: this.busIcon
      }).addTo(this.map);
    } else {
      this.busMarker.setLatLng(position);
    }

    // Update popup content
    this.busMarker.bindPopup(`
      <strong>Bus Status: ${this.busLocation.status}</strong><br>
      Speed: ${this.busLocation.speed} km/h<br>
      Last Update: ${new Date(this.busLocation.lastUpdate).toLocaleTimeString()}
    `).openPopup();

    // Rotate bus icon based on heading
    if (this.busLocation.heading) {
      const iconElement = this.busMarker.getElement();
      if (iconElement) {
        iconElement.style.transform += ` rotate(${this.busLocation.heading}deg)`;
      }
    }
  }

  // Public methods for external control
  public centerOnBus() {
    if (this.busLocation) {
      this.map.setView(
        [this.busLocation.latitude, this.busLocation.longitude],
        this.map.getZoom()
      );
    }
  }

  public centerOnStop(stop: RouteStop) {
    this.map.setView([stop.latitude, stop.longitude], this.map.getZoom());
  }

  public fitAllMarkers() {
    const allMarkers = [
      ...this.stopMarkers,
      this.busMarker,
      ...this.markers
    ].filter(marker => marker != null) as L.Marker[];

    if (allMarkers.length > 0) {
      const group = L.featureGroup(allMarkers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }
}