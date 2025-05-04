"use client";

import { useRef, useEffect } from "react";

interface VideoSectionProps {
  title: string;
  description: string;
  videoSrc: string;
}

const VideoSection = ({ title, description, videoSrc }: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto max-w-[90%]">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 text-right lg:p-12">
            <h2 className="mb-4 text-3xl font-bold text-black">{title}</h2>
            <div className="mb-8 ml-auto h-1 w-24 bg-red-600"></div>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              {description}
            </p>
          </div>
          <div className="relative">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={videoSrc}
              muted
              loop
              playsInline
              controls
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
