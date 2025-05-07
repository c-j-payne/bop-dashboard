import { create } from "zustand";
import { useEffect, useRef, useState } from "react";
import type {
  RobotClient,
  StreamClient,
  SensorClient,
  CameraClient,
} from "@viamrobotics/sdk";
import {
  getRobotClient,
  getStreamClient,
  getSensorClient,
  getCameraClient,
  getStream,
} from "./client";

export type ClientStatus = "disconnected" | "loading" | "connected";

export interface Store {
  status: ClientStatus;
  client?: RobotClient;
  streamClient?: StreamClient;
  connectOrDisconnect: () => void;
}

export const useStore = create<Store>((set, get) => ({
  status: "disconnected",
  client: undefined,
  streamClient: undefined,
  connectOrDisconnect: () => {
    const status = get().status;
    if (status === "disconnected") {
      console.log(`Currently disconnected, connecting...`);
      console.log("Setting state to 'loading'...");
      set({ status: "loading" });
  
      console.log(`Getting robot client...`);
      getRobotClient()
        .then((client) => {
          console.log(`Got client successfully, checking resource names...`);
          
          // Log available resources
          client.resourceNames()
            .then(resources => {
              console.log("Available resources:", resources);
            })
            .catch(err => {
              console.error("Error getting resource names:", err);
            });
            
          console.log(`Getting stream client`);
          const streamClient = getStreamClient(client);
          console.log(`Received stream client`);
  
          const stateUpdate = {
            status: "connected" as ClientStatus,
            client,
            streamClient,
          };
          console.log(`Setting state to connected`);
          set(stateUpdate);
          console.log("Set state to connected");
        })
        .catch((error: unknown) => {
          console.error("Detailed connection error:", error);
          set({ status: "disconnected" });
        });
    } else if (status === "connected") {
      console.log(`Currently connected, disconnecting...`);
      set({ status: "loading" });
  
      // Simplified disconnection
      set({ status: "disconnected", client: undefined, streamClient: undefined });
    }
  },
}));

// Update the useStream function in state.ts to fix the typing issue
export const useStream = (
    streamClient: StreamClient | undefined,
    cameraName: string
  ): MediaStream | undefined => {
    const okToConnectRef = useRef(true);
    const [stream, setStream] = useState<MediaStream | undefined>();
  
    useEffect(() => {
      if (streamClient && okToConnectRef.current) {
        console.log(`Starting stream connection for camera: ${cameraName}`);
        okToConnectRef.current = false;
  
        getStream(streamClient, cameraName)
          .then((mediaStream: MediaStream) => {
            console.log(`Successfully got media stream for ${cameraName}`, mediaStream);
            setStream(mediaStream);
          })
          .catch((error: unknown) => {
            console.error(`Error connecting to camera ${cameraName}:`, error);
          });
  
        return () => {
          console.log(`Cleaning up stream for camera: ${cameraName}`);
          okToConnectRef.current = true;
  
          streamClient.remove(cameraName).catch((error: unknown) => {
            console.error(`Error disconnecting from camera ${cameraName}:`, error);
          });
        };
      }
  
      return undefined;
    }, [streamClient, cameraName]);
  
    return stream;
  };
  
export const useSensorReadings = (
  client: RobotClient | undefined,
  sensorName: string
) => {
  const [readings, setReadings] = useState<Record<string, any> | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client) return;

    const fetchReadings = async () => {
      try {
        setLoading(true);
        const sensorClient = getSensorClient(client, sensorName);
        const data = await sensorClient.getReadings();
        setReadings(data);
      } catch (error) {
        console.error(`Error fetching readings from ${sensorName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
    const interval = setInterval(fetchReadings, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [client, sensorName]);

  return { readings, loading };
};