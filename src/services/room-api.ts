
import { Room } from "@/types";
import { mockRooms } from "./mock-data";

export const roomApi = {
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
  }
};
