
import { toast } from "sonner";
import { Platform } from '@capacitor/core';

// API constants
export const DEFAULT_API_BASE_URL = "http://192.168.1.100";  // Default gateway, will be configurable
export const API_TIMEOUT = 5000; // 5 seconds timeout

// Configuration for device API endpoints
export const configureApiEndpoint = (baseUrl: string) => {
  localStorage.setItem('device_api_endpoint', baseUrl);
};

export const getApiEndpoint = (): string => {
  return localStorage.getItem('device_api_endpoint') || DEFAULT_API_BASE_URL;
};

// Helper function to handle API requests with timeout
export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> => {
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

// Check if running on mobile device
export const isMobileApp = async (): Promise<boolean> => {
  try {
    return await Platform.isNativePlatform();
  } catch (error) {
    console.error("Error checking platform:", error);
    return false;
  }
};

// New function to discover local devices on the network
export const discoverDevices = async (): Promise<{found: boolean, endpoint?: string}> => {
  const isMobile = await isMobileApp();
  console.log("Discovering devices. Is mobile:", isMobile);
  
  // This would implement mDNS or other discovery protocol in production
  // For demonstration, we'll try a few common local IP addresses
  const possibleEndpoints = [
    'http://192.168.1.100',
    'http://192.168.1.101',
    'http://192.168.1.102',
    'http://192.168.0.100',
    'http://192.168.0.101'
  ];
  
  // On mobile, we might want to use a different discovery mechanism
  if (isMobile) {
    // Mobile-specific discovery logic could go here
    toast.info("Searching for devices on your home network...");
  }
  
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
};

// Configure API endpoint manually
export const configureEndpoint = (endpoint: string): void => {
  configureApiEndpoint(endpoint);
  toast.success(`API endpoint set to ${endpoint}`);
};
