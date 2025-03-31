
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Device } from '@/types';
import { 
  Lightbulb, 
  Fan, 
  Thermometer, 
  Power 
} from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string, isOn: boolean) => void;
  onBrightnessChange?: (id: string, brightness: number) => void;
  onTemperatureChange?: (id: string, temperature: number) => void;
  onSpeedChange?: (id: string, speed: number) => void;
}

export const DeviceCard = ({
  device,
  onToggle,
  onBrightnessChange,
  onTemperatureChange,
  onSpeedChange
}: DeviceCardProps) => {
  const getDeviceIcon = () => {
    switch (device.type) {
      case 'light':
        return <Lightbulb className={`h-6 w-6 ${device.isOn ? 'text-amber-400' : 'text-gray-400'}`} />;
      case 'fan':
        return <Fan className={`h-6 w-6 ${device.isOn ? 'text-blue-500' : 'text-gray-400'}`} />;
      case 'ac':
        return <Thermometer className={`h-6 w-6 ${device.isOn ? 'text-blue-500' : 'text-gray-400'}`} />;
      default:
        return <Power className={`h-6 w-6 ${device.isOn ? 'text-green-500' : 'text-gray-400'}`} />;
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (device.type === 'light' && onBrightnessChange) {
      onBrightnessChange(device.id, value[0]);
    } else if (device.type === 'ac' && onTemperatureChange) {
      onTemperatureChange(device.id, value[0]);
    } else if (device.type === 'fan' && onSpeedChange) {
      onSpeedChange(device.id, value[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
        {getDeviceIcon()}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Power</span>
            <Switch 
              checked={device.isOn} 
              onCheckedChange={(checked) => onToggle(device.id, checked)}
            />
          </div>
          
          {device.type === 'light' && device.brightness !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Brightness</span>
                <span className="text-sm text-gray-500">{device.brightness}%</span>
              </div>
              <Slider 
                disabled={!device.isOn}
                value={[device.brightness]} 
                min={1} 
                max={100} 
                step={1} 
                onValueChange={handleSliderChange}
              />
            </div>
          )}
          
          {device.type === 'ac' && device.temperature !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Temperature</span>
                <span className="text-sm text-gray-500">{device.temperature}°C</span>
              </div>
              <Slider 
                disabled={!device.isOn}
                value={[device.temperature]} 
                min={16} 
                max={30} 
                step={0.5} 
                onValueChange={handleSliderChange}
              />
            </div>
          )}
          
          {device.type === 'fan' && device.speed !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Speed</span>
                <span className="text-sm text-gray-500">{device.speed}</span>
              </div>
              <Slider 
                disabled={!device.isOn}
                value={[device.speed]} 
                min={1} 
                max={5} 
                step={1} 
                onValueChange={handleSliderChange}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
