
import { Device, Room, User } from "@/types";

// Replace with your actual API endpoint
const API_BASE_URL = "https://your-api-endpoint.com";

// Mock data for demonstration (remove this in production)
let mockDevices: Device[] = [
  {
    id: "1",
    name: "Living Room Light",
    type: "light",
    roomId: "1",
    isOn: false,
    brightness: 70
  },
  {
    id: "2",
    name: "Bedroom AC",
    type: "ac",
    roomId: "2",
    isOn: false,
    temperature: 22
  },
  {
    id: "3",
    name: "Kitchen Fan",
    type: "fan",
    roomId: "3",
    isOn: false,
    speed: 3
  }
];

let mockRooms: Room[] = [
  { id: "1", name: "Living Room" },
  { id: "2", name: "Bedroom" },
  { id: "3", name: "Kitchen" }
];

// Use these functions to interact with your actual API in production
export const api = {
  // Device functions
  getDevices: async (): Promise<Device[]> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/devices`);
      // if (!response.ok) throw new Error('Failed to fetch devices');
      // return await response.json();
      
      // For demonstration, return mock data
      return mockDevices;
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  },

  getDevicesByRoom: async (roomId: string): Promise<Device[]> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/devices`);
      // if (!response.ok) throw new Error('Failed to fetch devices');
      // return await response.json();
      
      // For demonstration, filter mock data
      return mockDevices.filter(device => device.roomId === roomId);
    } catch (error) {
      console.error(`Error fetching devices for room ${roomId}:`, error);
      throw error;
    }
  },

  toggleDevice: async (deviceId: string, isOn: boolean): Promise<Device> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/toggle`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isOn })
      // });
      // if (!response.ok) throw new Error('Failed to toggle device');
      // return await response.json();
      
      // For demonstration, update mock data
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) throw new Error(`Device with ID ${deviceId} not found`);
      
      device.isOn = isOn;
      return { ...device };
    } catch (error) {
      console.error(`Error toggling device ${deviceId}:`, error);
      throw error;
    }
  },

  updateDeviceBrightness: async (deviceId: string, brightness: number): Promise<Device> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/brightness`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ brightness })
      // });
      // if (!response.ok) throw new Error('Failed to update brightness');
      // return await response.json();
      
      // For demonstration, update mock data
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) throw new Error(`Device with ID ${deviceId} not found`);
      if (device.type !== 'light') throw new Error(`Device ${deviceId} is not a light`);
      
      device.brightness = brightness;
      return { ...device };
    } catch (error) {
      console.error(`Error updating brightness for device ${deviceId}:`, error);
      throw error;
    }
  },

  updateDeviceTemperature: async (deviceId: string, temperature: number): Promise<Device> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/temperature`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ temperature })
      // });
      // if (!response.ok) throw new Error('Failed to update temperature');
      // return await response.json();
      
      // For demonstration, update mock data
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) throw new Error(`Device with ID ${deviceId} not found`);
      if (device.type !== 'ac') throw new Error(`Device ${deviceId} is not an AC`);
      
      device.temperature = temperature;
      return { ...device };
    } catch (error) {
      console.error(`Error updating temperature for device ${deviceId}:`, error);
      throw error;
    }
  },

  updateDeviceSpeed: async (deviceId: string, speed: number): Promise<Device> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/speed`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ speed })
      // });
      // if (!response.ok) throw new Error('Failed to update fan speed');
      // return await response.json();
      
      // For demonstration, update mock data
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) throw new Error(`Device with ID ${deviceId} not found`);
      if (device.type !== 'fan') throw new Error(`Device ${deviceId} is not a fan`);
      
      device.speed = speed;
      return { ...device };
    } catch (error) {
      console.error(`Error updating speed for device ${deviceId}:`, error);
      throw error;
    }
  },

  addDevice: async (device: Omit<Device, 'id' | 'isOn'>): Promise<Device> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/devices`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(device)
      // });
      // if (!response.ok) throw new Error('Failed to add device');
      // return await response.json();
      
      // For demonstration, add to mock data
      const newDevice: Device = {
        id: String(mockDevices.length + 1),
        isOn: false,
        ...device,
        ...(device.type === 'light' ? { brightness: 100 } : {}),
        ...(device.type === 'ac' ? { temperature: 22 } : {}),
        ...(device.type === 'fan' ? { speed: 3 } : {})
      };
      
      mockDevices.push(newDevice);
      return newDevice;
    } catch (error) {
      console.error("Error adding device:", error);
      throw error;
    }
  },

  // Room functions
  getRooms: async (): Promise<Room[]> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/rooms`);
      // if (!response.ok) throw new Error('Failed to fetch rooms');
      // return await response.json();
      
      // For demonstration, return mock data
      return mockRooms;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },

  addRoom: async (room: Omit<Room, 'id'>): Promise<Room> => {
    try {
      // For production, use the API
      // const response = await fetch(`${API_BASE_URL}/rooms`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(room)
      // });
      // if (!response.ok) throw new Error('Failed to add room');
      // return await response.json();
      
      // For demonstration, add to mock data
      const newRoom: Room = {
        id: String(mockRooms.length + 1),
        ...room
      };
      
      mockRooms.push(newRoom);
      return newRoom;
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  },

  // Authentication functions
  pairDevice: async (userId: string, deviceId: string): Promise<User> => {
    try {
      // For production, implement the actual pairing logic with your API
      // This is just a placeholder
      return {
        id: userId,
        name: "User",
        deviceId,
        isAuthorized: true
      };
    } catch (error) {
      console.error("Error pairing device:", error);
      throw error;
    }
  }
};
