import React from "react";
import { useStore, useSensorReadings } from "../state";

interface SensorDisplayProps {
  sensorName: string;
  title?: string;
}

const SensorDisplay: React.FC<SensorDisplayProps> = ({ 
  sensorName, 
  title = sensorName 
}) => {
  const { client, status } = useStore();
  const { readings, loading } = useSensorReadings(client, sensorName);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {status === "connected" ? (
        loading && !readings ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-2">
            {readings ? (
              Object.entries(readings).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span>{typeof value === "object" ? JSON.stringify(value) : value}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        )
      ) : (
        <div className="text-gray-500">Please connect to robot first</div>
      )}
    </div>
  );
};

export default SensorDisplay;