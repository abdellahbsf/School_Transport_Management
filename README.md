# School Transport Management System

A comprehensive school transportation management solution built with Angular 18, designed to optimize bus routes, manage student pickup locations, and enhance transportation efficiency.

## 🚀 Features

### Core Features
- **Schedule Management**: Create and manage bus schedules and routes
- **Interactive Maps**: Real-time bus tracking and route visualization using Leaflet
- **Student Profiles**: Manage student information and pickup locations
- **Route Optimization**: Automated route planning based on student locations
- **Real-time Notifications**: Updates on bus status and schedule changes
- **Dashboard Analytics**: Track and monitor transportation metrics

### Technical Features
- Standalone Angular components
- Signal-based state management
- Lazy-loaded modules for better performance
- Responsive design using Tailwind CSS
- Interactive maps with Leaflet integration
- Type-safe development with TypeScript

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 18
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **State Management**: Angular Signals
- **Routing**: Angular Router with lazy loading
- **HTTP Client**: Angular HttpClient

### Development Tools
- TypeScript
- RxJS
- Angular CLI
- npm/Node.js

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── map-picker/
│   │   ├── profile/
│   │   ├── schedule/
│   │   └── notifications/
│   ├── models/
│   │   ├── student.model.ts
│   │   ├── bus-location.model.ts
│   │   └── route-stop.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── bus-tracking.service.ts
│   │   └── navigation.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── pages/
       ├── login/
       ├── register/
       ├── dashboard/
       └── not-found/
```

## 🚦 Routes Configuration

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { 
    path: 'profile',
    loadComponent: () => import('./profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  { 
    path: 'track-bus',
    loadComponent: () => import('./bus-tracking/bus-tracking.component')
      .then(m => m.BusTrackingComponent)
  },
  { 
    path: 'schedule',
    loadComponent: () => import('./schedule/schedule.component')
      .then(m => m.ScheduleComponent)
  }
];
```

## 🔧 Setup and Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-transport-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`

4. **Build for production**
   ```bash
   ng build
   ```
   The build artifacts will be stored in the `dist/` directory.

## 💻 Development Guidelines

### Component Creation
- Use standalone components
- Implement proper type safety
- Follow Angular's style guide
- Use signals for state management

### Styling
- Use Tailwind CSS utilities
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic HTML

### Code Quality
- Write unit tests for components
- Maintain proper documentation
- Follow Angular best practices
- Use TypeScript strictly

## 🔄 State Management

The application uses Angular's signals for state management:

```typescript
interface Schedule {
  id: number;
  routeName: string;
  busId: string;
  startTime: string;
  endTime: string;
  stops: RouteStop[];
  daysActive: string[];
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private schedules = signal<Schedule[]>([]);
  
  getSchedules() {
    return this.schedules;
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


**Note**: This project is under active development. Features and documentation will be updated regularly.
