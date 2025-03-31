
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Device, Room } from '@/types';
import { api } from '@/services/api';
import { DeviceCard } from '@/components/DeviceCard';
import { RoomSelector } from '@/components/RoomSelector';
import { AddDeviceForm } from '@/components/AddDeviceForm';
import { AddRoomForm } from '@/components/AddRoomForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

const Index = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch rooms data
  const { 
    data: rooms = [], 
    isLoading: roomsLoading, 
    error: roomsError 
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: api.getRooms
  });

  // Set the first room as selected by default
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  // Fetch devices data for the selected room
  const { 
    data: devices = [], 
    isLoading: devicesLoading, 
    error: devicesError 
  } = useQuery({
    queryKey: ['devices', selectedRoomId],
    queryFn: () => selectedRoomId ? api.getDevicesByRoom(selectedRoomId) : api.getDevices(),
    enabled: !!selectedRoomId || rooms.length === 0
  });

  // Add Room Mutation
  const addRoomMutation = useMutation({
    mutationFn: api.addRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add room: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Add Device Mutation
  const addDeviceMutation = useMutation({
    mutationFn: (device: Omit<Device, 'id' | 'isOn'>) => api.addDevice(device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Device added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Toggle Device Mutation
  const toggleDeviceMutation = useMutation({
    mutationFn: ({ id, isOn }: { id: string; isOn: boolean }) => api.toggleDevice(id, isOn),
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData(['devices', selectedRoomId], (oldData: Device[] | undefined) => {
        if (!oldData) return [updatedDevice];
        return oldData.map(device => device.id === updatedDevice.id ? updatedDevice : device);
      });
      toast.success(`${updatedDevice.name} turned ${updatedDevice.isOn ? 'on' : 'off'}`);
    },
    onError: (error) => {
      toast.error(`Failed to toggle device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Update Brightness Mutation
  const updateBrightnessMutation = useMutation({
    mutationFn: ({ id, brightness }: { id: string; brightness: number }) => api.updateDeviceBrightness(id, brightness),
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData(['devices', selectedRoomId], (oldData: Device[] | undefined) => {
        if (!oldData) return [updatedDevice];
        return oldData.map(device => device.id === updatedDevice.id ? updatedDevice : device);
      });
    }
  });

  // Update Temperature Mutation
  const updateTemperatureMutation = useMutation({
    mutationFn: ({ id, temperature }: { id: string; temperature: number }) => api.updateDeviceTemperature(id, temperature),
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData(['devices', selectedRoomId], (oldData: Device[] | undefined) => {
        if (!oldData) return [updatedDevice];
        return oldData.map(device => device.id === updatedDevice.id ? updatedDevice : device);
      });
    }
  });

  // Update Fan Speed Mutation
  const updateSpeedMutation = useMutation({
    mutationFn: ({ id, speed }: { id: string; speed: number }) => api.updateDeviceSpeed(id, speed),
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData(['devices', selectedRoomId], (oldData: Device[] | undefined) => {
        if (!oldData) return [updatedDevice];
        return oldData.map(device => device.id === updatedDevice.id ? updatedDevice : device);
      });
    }
  });

  const handleAddRoom = (room: { name: string }) => {
    addRoomMutation.mutate(room);
  };

  const handleAddDevice = (device: {
    name: string;
    type: 'light' | 'fan' | 'ac' | 'other';
    roomId: string;
  }) => {
    addDeviceMutation.mutate(device);
  };

  const handleToggleDevice = (id: string, isOn: boolean) => {
    toggleDeviceMutation.mutate({ id, isOn });
  };

  const handleBrightnessChange = (id: string, brightness: number) => {
    updateBrightnessMutation.mutate({ id, brightness });
  };

  const handleTemperatureChange = (id: string, temperature: number) => {
    updateTemperatureMutation.mutate({ id, temperature });
  };

  const handleSpeedChange = (id: string, speed: number) => {
    updateSpeedMutation.mutate({ id, speed });
  };

  if (roomsLoading) {
    return <div className="flex justify-center items-center h-screen">Loading rooms...</div>;
  }

  if (roomsError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error loading rooms</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 p-4 bg-background z-10 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Home</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto pt-20 pb-20 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Rooms</h2>
          <AddRoomForm onAddRoom={handleAddRoom} />
        </div>

        {rooms.length > 0 ? (
          <RoomSelector
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onRoomSelect={setSelectedRoomId}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No rooms added yet. Add a room to get started.</p>
          </div>
        )}

        {selectedRoomId && (
          <>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {rooms.find(room => room.id === selectedRoomId)?.name} Devices
            </h2>

            {devicesLoading ? (
              <div className="text-center py-8">Loading devices...</div>
            ) : devicesError ? (
              <div className="text-center py-8 text-red-500">Error loading devices</div>
            ) : devices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onToggle={handleToggleDevice}
                    onBrightnessChange={device.type === 'light' ? handleBrightnessChange : undefined}
                    onTemperatureChange={device.type === 'ac' ? handleTemperatureChange : undefined}
                    onSpeedChange={device.type === 'fan' ? handleSpeedChange : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No devices in this room yet. Add a device to get started.</p>
              </div>
            )}
          </>
        )}
      </main>

      <AddDeviceForm rooms={rooms} onAddDevice={handleAddDevice} />
    </div>
  );
};

export default Index;
