// model/bus-tracking.model.ts
export interface BusLocation {
  busId: number;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  lastUpdate: Date;
  routeId: number;
  status: 'ON_ROUTE' | 'DELAYED' | 'STOPPED' | 'OFF_ROUTE';
  estimatedArrival: Date;
}

export interface RouteStop {
  stopId: number;
  name: string;
  latitude: number;
  longitude: number;
  estimatedArrival: Date;
  sequence: number;
}