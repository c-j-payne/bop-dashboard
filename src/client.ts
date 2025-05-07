import {
    createRobotClient,
    RobotClient,
    StreamClient,
    SensorClient,
    CameraClient
  } from "@viamrobotics/sdk";
  
  // Main function to get the robot client
  export const getRobotClient = async (): Promise<RobotClient> => {
    try {
      console.log("Starting robot client connection...");
      const host = 'bop2025-main.1qcq9pmop4.viam.cloud';
      
      // Use a simple config format
      const config = {
        host,
        credentials: {
          type: 'api-key',
          authEntity: '2597529f-b98b-4e62-8c94-7f99501b0a76',
          payload: 'hxtk88rojiq2pzc7nasiiymnbfxr1dyc',
        },
        signalingAddress: "https://app.viam.com:443",
        iceServers: [{ urls: "stun:global.stun.twilio.com:3478" }],
      };
      
      return await createRobotClient(config as any);
    } catch (error) {
      console.error("Error creating robot client:", error);
      throw error;
    }
  };
  
  // Create a StreamClient instance
  export const getStreamClient = (client: RobotClient): StreamClient => {
    if (!StreamClient) {
      throw new Error("StreamClient is not available in the SDK");
    }
    return new StreamClient(client);
  };
  
  // Create a CameraClient instance
  export const getCameraClient = (client: RobotClient, cameraName: string): CameraClient => {
    return new CameraClient(client, cameraName);
  };
  
  // Create a SensorClient instance
  export const getSensorClient = (client: RobotClient, sensorName: string): SensorClient => {
    return new SensorClient(client, sensorName);
  };
  
  // Helper function to get a media stream from a camera
  export const getStream = async (
    streamClient: StreamClient,
    name: string
  ): Promise<MediaStream> => {
    console.log(`Getting stream for camera: ${name}`);
    
    const streamPromise = new Promise<MediaStream>((resolve, reject) => {
      const handleTrack = (event: RTCTrackEvent) => {
        const stream = event.streams[0];
  
        if (!stream) {
          streamClient.off("track", handleTrack as (args: unknown) => void);
          reject(new Error("Received track event with no streams"));
        } else if (stream.id === name) {
          streamClient.off("track", handleTrack as (args: unknown) => void);
          resolve(stream);
        }
      };
  
      streamClient.on("track", handleTrack as (args: unknown) => void);
    });
  
    try {
      await streamClient.add(name);
      return streamPromise;
    } catch (error) {
      console.error(`Error adding stream for ${name}:`, error);
      throw error;
    }
  };