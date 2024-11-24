export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface Student {
    id: number;
    name: string;
    email: string;
    phoneNumber: string,
    username: string;
    pickupLocation: Location;
    // Add other fields as necessary
  }
  