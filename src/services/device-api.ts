
import { Device } from "@/types";
import { fetchWithTimeout, getApiEndpoint } from "./api-core";
import { mockDevices } from "./mock-data";
import { toast } from "sonner";

export const deviceApi = {
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
  }
};
