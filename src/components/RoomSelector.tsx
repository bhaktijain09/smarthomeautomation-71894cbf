
import React from 'react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: string;
  onRoomSelect: (roomId: string) => void;
}

export const RoomSelector = ({ 
  rooms, 
  selectedRoomId, 
  onRoomSelect 
}: RoomSelectorProps) => {
  return (
    <div className="flex overflow-x-auto py-2 mb-4 no-scrollbar">
      <div className="flex space-x-2">
        {rooms.map((room) => (
          <Button
            key={room.id}
            variant={room.id === selectedRoomId ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap",
              room.id === selectedRoomId 
                ? "bg-primary text-primary-foreground" 
                : "bg-background"
            )}
            onClick={() => onRoomSelect(room.id)}
          >
            {room.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
