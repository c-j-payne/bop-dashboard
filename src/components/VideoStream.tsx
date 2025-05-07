import React, { useEffect, useRef } from "react";
import { useStore, useStream } from "../state";

interface VideoStreamProps {
  cameraName: string;
  theme?: "default" | "dark" | "accent";
  size?: "sm" | "md" | "lg";
}

const VideoStream: React.FC<VideoStreamProps> = ({ 
  cameraName,
  theme = "default",
  size = "md"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { streamClient, status } = useStore();
  const stream = useStream(streamClient, cameraName);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "p-2",
      title: "text-xs",
      icon: "w-2.5 h-2.5",
      spinner: "w-3 h-3",
      statusIcon: "w-3 h-3",
      gap: "gap-1"
    },
    md: {
      container: "p-3",
      title: "text-sm",
      icon: "w-3 h-3",
      spinner: "w-4 h-4",
      statusIcon: "w-4 h-4",
      gap: "gap-1.5"
    },
    lg: {
      container: "p-4",
      title: "text-base",
      icon: "w-4 h-4",
      spinner: "w-5 h-5",
      statusIcon: "w-5 h-5",
      gap: "gap-2"
    }
  };

  // Theme styles
  const themeStyles = {
    default: {
      container: "bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200",
      title: "text-gray-800",
      placeholderBg: "bg-gray-100",
      placeholderText: "text-gray-500",
      spinner: "border-gray-500",
    },
    dark: {
      container: "bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-200",
      title: "text-white",
      placeholderBg: "bg-gray-700",
      placeholderText: "text-gray-300",
      spinner: "border-gray-300",
    },
    accent: {
      container: "bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all duration-200",
      title: "text-blue-800",
      placeholderBg: "bg-blue-100",
      placeholderText: "text-blue-600",
      spinner: "border-blue-500",
    }
  };
  
  const styles = themeStyles[theme];
  const sizeStyles = sizeConfig[size];

  return (
    <div className={`rounded-lg shadow-md ${sizeStyles.container} ${styles.container}`}>
      <h2 className={`font-semibold mb-3 flex items-center ${sizeStyles.gap} ${sizeStyles.title} ${styles.title}`}>
        <svg className={sizeStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {cameraName}
      </h2>
      <div className="relative aspect-video">
        {status === "connected" ? (
          stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className={`${styles.placeholderBg} h-full flex items-center justify-center rounded`}>
              <div className={`flex flex-col items-center ${sizeStyles.gap}`}>
                <div className={`${sizeStyles.spinner} border-4 ${styles.spinner} border-t-transparent rounded-full animate-spin`} />
                <p className={styles.placeholderText}>Loading camera feed...</p>
              </div>
            </div>
          )
        ) : (
          <div className={`${styles.placeholderBg} h-full flex items-center justify-center rounded`}>
            <div className={`flex flex-col items-center ${sizeStyles.gap}`}>
              <svg className={sizeStyles.statusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className={styles.placeholderText}>Please connect to robot first</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStream;