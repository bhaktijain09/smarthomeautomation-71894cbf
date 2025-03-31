
import { Device, Room } from "@/types";

// Mock data for demonstration (remove this in production)
export const mockDevices: Device[] = [
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

export const mockRooms: Room[] = [
  { id: "1", name: "Living Room" },
  { id: "2", name: "Bedroom" },
  { id: "3", name: "Kitchen" }
];
