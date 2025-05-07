import React from "react";
import { useStore } from "../state";
import VideoStream from "./VideoStream";
import SensorDisplay from "./SensorDisplay";

const ViamDashboard: React.FC = () => {
  const { status, connectOrDisconnect } = useStore();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Viam Robot Dashboard</h1>
        <button
          onClick={connectOrDisconnect}
          className={`px-4 py-2 rounded font-medium ${
            status === "connected"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : status === "loading"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={status === "loading"}
        >
          {status === "connected"
            ? "Disconnect"
            : status === "loading"
            ? "Connecting..."
            : "Connect"}
        </button>
        {status === "connected" && (
          <span className="ml-2 text-green-500">Connected to robot</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VideoStream cameraName="camera-1" />

        <div className="space-y-6">
          <SensorDisplay sensorName="temperature" title="Temperature Sensor" />
          <SensorDisplay sensorName="sensor-1" title="Sensor 1" />
          <SensorDisplay sensorName="gateway-waveshare" title="Gateway Waveshare" />
        </div>
      </div>
    </div>
  );
};

export default ViamDashboard;