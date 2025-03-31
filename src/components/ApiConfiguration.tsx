
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Wifi } from "lucide-react";
import { api, getApiEndpoint } from "@/services/api";
import { toast } from "sonner";

export const ApiConfiguration = () => {
  const [endpoint, setEndpoint] = useState<string>(getApiEndpoint());
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!endpoint) {
      toast.error("Please enter a valid endpoint");
      return;
    }
    
    try {
      // Validate URL format
      new URL(endpoint);
      api.configureEndpoint(endpoint);
      setIsOpen(false);
    } catch (e) {
      toast.error("Please enter a valid URL (e.g., http://192.168.1.100)");
    }
  };

  const handleDiscover = async () => {
    setIsDiscovering(true);
    try {
      const result = await api.discoverDevices();
      if (result.found && result.endpoint) {
        setEndpoint(result.endpoint);
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wifi className="h-4 w-4" />
          <span className="hidden sm:inline">Configure Devices</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Smart Home Device Configuration</DialogTitle>
          <DialogDescription>
            Configure the API endpoint for your Wi-Fi-enabled devices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right col-span-1">
              API Endpoint
            </Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="http://192.168.1.100"
              className="col-span-3"
            />
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleDiscover}
              disabled={isDiscovering}
              className="w-full"
            >
              {isDiscovering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDiscovering ? "Discovering..." : "Auto-Discover Devices"}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
