
export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'other';
  roomId: string;
  isOn: boolean;
  // Additional properties based on device type
  brightness?: number; // For lights
  temperature?: number; // For ACs
  speed?: number; // For fans
}

export interface Room {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  deviceId: string; // For device-based authentication
  isAuthorized: boolean;
}
