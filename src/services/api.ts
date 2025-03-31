import { Device, Room, User } from "@/types";
import { toast } from "sonner";

// Replace with your actual API endpoint for Wi-Fi devices
const API_BASE_URL = "http://192.168.1.100";  // Default gateway, will be configurable
const API_TIMEOUT = 5000; // 5 seconds timeout

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

// Helper function to handle API requests with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    console.error("API request failed:", error);
    throw error;
  }
};

// Configuration for device API endpoints
export const configureApiEndpoint = (baseUrl: string) => {
  localStorage.setItem('device_api_endpoint', baseUrl);
};

export const getApiEndpoint = (): string => {
  return localStorage.getItem('device_api_endpoint') || API_BASE_URL;
};

export const api = {
  // Device functions
  getDevices: async (): Promise<Device[]> => {
    try {
      // Try to get devices from real API first
      const apiEndpoint = getApiEndpoint();
      try {
        const response = await fetchWithTimeout(`${apiEndpoint}/api/devices`);
        if (response.ok) {
          const data = await response.json();
          return data.map((device: any) => ({
            id: device.id.toString(),
            name: device.name,
            type: device.type,
            roomId: device.room_id.toString(),
            isOn: device.is_on,
            ...(device.type === 'light' ? { brightness: device.brightness } : {}),
            ...(device.type === 'ac' ? { temperature: device.temperature } : {}),
            ...(device.type === 'fan' ? { speed: device.speed } : {})
          }));
        }
      } catch (error) {
        console.log("Using mock data instead, couldn't connect to devices:", error);
      }
      
      // Fallback to mock data for demonstration
      return mockDevices;
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  },

  getDevicesByRoom: async (roomId: string): Promise<Device[]> => {
    try {
      // Try to get devices from real API first
      const apiEndpoint = getApiEndpoint();
      try {
        const response = await fetchWithTimeout(`${apiEndpoint}/api/rooms/${roomId}/devices`);
        if (response.ok) {
          const data = await response.json();
          return data.map((device: any) => ({
            id: device.id.toString(),
            name: device.name,
            type: device.type,
            roomId: device.room_id.toString(),
            isOn: device.is_on,
            ...(device.type === 'light' ? { brightness: device.brightness } : {}),
            ...(device.type === 'ac' ? { temperature: device.temperature } : {}),
            ...(device.type === 'fan' ? { speed: device.speed } : {})
          }));
        }
      } catch (error) {
        console.log("Using mock data instead, couldn't connect to devices:", error);
      }
      
      // Fallback to mock data for demonstration
      return mockDevices.filter(device => device.roomId === roomId);
    } catch (error) {
      console.error(`Error fetching devices for room ${roomId}:`, error);
      throw error;
    }
  },

  toggleDevice: async (deviceId: string, isOn: boolean): Promise<Device> => {
    try {
      // Try to control real device first
      const apiEndpoint = getApiEndpoint();
      try {
        const response = await fetchWithTimeout(`${apiEndpoint}/api/devices/${deviceId}/toggle`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_on: isOn })
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            id: data.id.toString(),
            name: data.name,
            type: data.type,
            roomId: data.room_id.toString(),
            isOn: data.is_on,
            ...(data.type === 'light' ? { brightness: data.brightness } : {}),
            ...(data.type === 'ac' ? { temperature: data.temperature } : {}),
            ...(data.type === 'fan' ? { speed: data.speed } : {})
          };
        }
      } catch (error) {
        console.log("Using mock data instead, couldn't connect to device:", error);
        toast.error("Failed to connect to device. Using simulation mode.");
      }
      
      // Fallback to mock data for demonstration
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
      // Try to control real device first
      const apiEndpoint = getApiEndpoint();
      try {
        const response = await fetchWithTimeout(`${apiEndpoint}/api/devices/${deviceId}/brightness`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brightness })
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            id: data.id.toString(),
            name: data.name,
            type: data.type,
            roomId: data.room_id.toString(),
            isOn: data.is_on,
            brightness: data.brightness
          };
        }
      } catch (error) {
        console.log("Using mock data instead, couldn't connect to device:", error);
        toast.error("Failed to connect to device. Using simulation mode.");
      }
      
      // Fallback to mock data for demonstration
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
      // Try to control real device first
      const apiEndpoint = getApiEndpoint();
      try {
        const response = await fetchWithTimeout(`${apiEndpoint}/api/devices/${deviceId}/temperature`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ temperature })
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            id: data.id.toString(),
            name: data.name,
            type: data.type,
            roomId: data.room_id.toString(),
            isOn: data.is_on,
            temperature: data.temperature
          };
        }
      } catch (error) {
        console.log("Using mock data instead, couldn't connect to device:", error);
        toast.error("Failed to connect to device. Using simulation mode.");
      }
      
      // Fallback to mock data for demonstration
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
      // Try to control real device first
      const apiEndpoint = getApiEndpoint();
      try {
        const response = await fetchWithTimeout(`${apiEndpoint}/api/devices/${deviceId}/speed`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speed })
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            id: data.id.toString(),
            name: data.name,
            type: data.type,
            roomId: data.room_id.toString(),
            isOn: data.is_on,
            speed: data.speed
          };
        }
      } catch (error) {
        console.log("Using mock data instead, couldn't connect to device:", error);
        toast.error("Failed to connect to device. Using simulation mode.");
      }
      
      // Fallback to mock data for demonstration
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
  },

  // New function to discover local devices on the network
  discoverDevices: async (): Promise<{found: boolean, endpoint?: string}> => {
    // This would implement mDNS or other discovery protocol in production
    // For demonstration, we'll try a few common local IP addresses
    const possibleEndpoints = [
      'http://192.168.1.100',
      'http://192.168.1.101',
      'http://192.168.1.102',
      'http://192.168.0.100',
      'http://192.168.0.101'
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        const response = await fetchWithTimeout(`${endpoint}/api/status`, {}, 1000);
        if (response.ok) {
          // Found a device, save endpoint
          configureApiEndpoint(endpoint);
          toast.success(`Connected to smart home hub at ${endpoint}`);
          return { found: true, endpoint };
        }
      } catch (error) {
        // Continue trying other endpoints
        console.log(`No device found at ${endpoint}`);
      }
    }
    
    toast.error("No smart home devices found on your network");
    return { found: false };
  },
  
  // Configure API endpoint manually
  configureEndpoint: (endpoint: string): void => {
    configureApiEndpoint(endpoint);
    toast.success(`API endpoint set to ${endpoint}`);
  }
};
