
import { User } from "@/types";
import { Platform } from '@capacitor/core';

export const authApi = {
  // Authentication functions
  pairDevice: async (userId: string, deviceId: string): Promise<User> => {
    try {
      // Check if running on a mobile device
      const isPlatformMobile = await Platform.isNativePlatform();
      
      console.log("Pairing device. Is mobile platform:", isPlatformMobile);
      
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
  
  // Method to check if the app is running on a mobile platform
  isMobilePlatform: async (): Promise<boolean> => {
    try {
      return await Platform.isNativePlatform();
    } catch (error) {
      console.error("Error checking platform:", error);
      return false;
    }
  }
};
