
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Room } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

interface AddDeviceFormProps {
  rooms: Room[];
  onAddDevice: (device: {
    name: string;
    type: 'light' | 'fan' | 'ac' | 'other';
    roomId: string;
  }) => void;
}

type DeviceFormValues = {
  name: string;
  type: 'light' | 'fan' | 'ac' | 'other';
  roomId: string;
}

export const AddDeviceForm = ({ rooms, onAddDevice }: AddDeviceFormProps) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<DeviceFormValues>({
    defaultValues: {
      name: '',
      type: 'light',
      roomId: rooms.length > 0 ? rooms[0].id : '',
    }
  });

  const selectedType = watch('type');

  const onSubmit = (data: DeviceFormValues) => {
    onAddDevice(data);
    reset();
    setOpen(false);
  };

  const handleTypeChange = (value: string) => {
    // Cast the value to the correct type union
    setValue('type', value as 'light' | 'fan' | 'ac' | 'other');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              placeholder="Living Room Light"
              {...register('name', { required: "Device name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Device Type</Label>
            <Select 
              defaultValue="light"
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="fan">Fan</SelectItem>
                <SelectItem value="ac">AC</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Select 
              defaultValue={rooms.length > 0 ? rooms[0].id : ''}
              onValueChange={(value) => setValue('roomId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Device</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
