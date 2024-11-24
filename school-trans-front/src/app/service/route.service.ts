// src/app/services/route.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../model/Student';



@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'http://localhost:8080/api/bus-routes/optimize';

  constructor(private http: HttpClient) {}

  getOptimizedRoute(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }
}
