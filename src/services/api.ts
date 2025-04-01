
import { deviceApi } from './device-api';
import { roomApi } from './room-api';
import { authApi } from './auth-api';
import { configureApiEndpoint, getApiEndpoint, discoverDevices, configureEndpoint, isMobileApp } from './api-core';

// Re-export everything for backward compatibility
export {
  configureApiEndpoint,
  getApiEndpoint,
  discoverDevices,
  configureEndpoint,
  isMobileApp
};

// Combine all APIs into a single object
export const api = {
  // Device functions
  getDevices: deviceApi.getDevices,
  getDevicesByRoom: deviceApi.getDevicesByRoom,
  toggleDevice: deviceApi.toggleDevice,
  updateDeviceBrightness: deviceApi.updateDeviceBrightness,
  updateDeviceTemperature: deviceApi.updateDeviceTemperature,
  updateDeviceSpeed: deviceApi.updateDeviceSpeed,
  addDevice: deviceApi.addDevice,
  
  // Room functions
  getRooms: roomApi.getRooms,
  addRoom: roomApi.addRoom,
  
  // Authentication functions
  pairDevice: authApi.pairDevice,
  isMobilePlatform: authApi.isMobilePlatform,
  
  // Discovery and configuration functions
  discoverDevices,
  configureEndpoint,
  isMobileApp
};
