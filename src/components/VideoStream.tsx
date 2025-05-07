import React, { useEffect, useRef } from "react";
import { useStore, useStream } from "../state";

interface VideoStreamProps {
  cameraName: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ cameraName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { streamClient, status } = useStore();
  const stream = useStream(streamClient, cameraName);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">{cameraName}</h2>
      {status === "connected" ? (
        stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded"
          />
        ) : (
          <div className="bg-gray-100 p-8 text-center rounded">
            Loading camera feed...
          </div>
        )
      ) : (
        <div className="bg-gray-100 p-8 text-center rounded">
          Please connect to robot first
        </div>
      )}
    </div>
  );
};

export default VideoStream;