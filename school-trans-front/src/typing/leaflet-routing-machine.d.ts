import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): Control;

    class Control extends L.Control {
      constructor(options?: any);
      addTo(map: L.Map): this;
      setWaypoints(waypoints: Waypoint[]): this;
    }

    class Waypoint {
      constructor(latLng: L.LatLng, name?: string, options?: any);
      latLng: L.LatLng;
      name: string;
    }
  }

  interface ControlOptions extends L.ControlOptions {
    waypoints: L.LatLng[];
    routeWhileDragging?: boolean;
    show?: boolean;
  }

  class Control extends L.Control {
    constructor(options: ControlOptions);
    getWaypoints(): L.LatLng[];
    setWaypoints(waypoints: L.LatLng[]): void;
    on(type: 'routesfound', fn: (e: RoutingResultEvent) => void): this;
  }

  interface RoutingResultEvent {
    routes: IRoute[];
  }

  interface IRoute {
    coordinates: L.LatLng[];
  }
}

declare module 'leaflet-routing-machine' {
  const Routing: typeof L.Routing;
  export = Routing;
}
