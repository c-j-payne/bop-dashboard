import React, { useState } from "react";
import { useStore } from "../state";
import VideoStream from "./VideoStream";
import SensorDisplay from "./SensorDisplay";

const ViamDashboard: React.FC = () => {
  const { status, connectOrDisconnect } = useStore();
  const [theme, setTheme] = useState<"default" | "dark" | "accent">("default");
  
  // Dashboard theme settings
  const dashboardThemes = {
    default: {
      background: "bg-gray-100",
      headerText: "text-gray-900",
      buttonConnect: "bg-blue-500 hover:bg-blue-600 text-white",
      buttonDisconnect: "bg-red-500 hover:bg-red-600 text-white",
      panelBg: "bg-white"
    },
    dark: {
      background: "bg-gray-900",
      headerText: "text-white",
      buttonConnect: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonDisconnect: "bg-red-600 hover:bg-red-700 text-white",
      panelBg: "bg-gray-800"
    },
    accent: {
      background: "bg-blue-50",
      headerText: "text-blue-900",
      buttonConnect: "bg-blue-500 hover:bg-blue-600 text-white",
      buttonDisconnect: "bg-red-500 hover:bg-red-600 text-white",
      panelBg: "bg-white"
    }
  };
  
  const currentTheme = dashboardThemes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className={`text-3xl font-bold ${currentTheme.headerText}`}>
            Viam Robot Dashboard
          </h1>
          
          <div className="flex mt-4 md:mt-0 space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${currentTheme.headerText}`}>Theme:</span>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as "default" | "dark" | "accent")}
                className="px-2 py-1 rounded border border-gray-300 text-sm"
              >
                <option value="default">Light</option>
                <option value="dark">Dark</option>
                <option value="accent">Blue</option>
              </select>
            </div>
            
            <button
              onClick={connectOrDisconnect}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                status === "connected"
                  ? currentTheme.buttonDisconnect
                  : status === "loading"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : currentTheme.buttonConnect
              }`}
              disabled={status === "loading"}
            >
              {status === "connected"
                ? "Disconnect"
                : status === "loading"
                ? "Connecting..."
                : "Connect"}
            </button>
          </div>
        </div>
        
        {status === "connected" && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Successfully connected to robot
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoStream cameraName="camera-1" theme={theme} size="sm" />
          </div>

          <div className="space-y-6">
            <SensorDisplay 
              sensorName="temperature" 
              title="Temperature Sensor" 
              theme={theme}
            />
            <SensorDisplay 
              sensorName="sensor-1" 
              title="Sensor 1" 
              theme={theme}
            />
            <SensorDisplay 
              sensorName="gateway-waveshare" 
              title="Gateway Waveshare" 
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViamDashboard;