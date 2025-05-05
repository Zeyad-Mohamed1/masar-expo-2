"use client";

import { useRef, useEffect } from "react";

interface VideoSectionProps {
  videoSrc: string;
}

const VideoSection = ({ videoSrc }: VideoSectionProps) => {
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
            <h2 className="mb-4 text-3xl font-bold text-black">
              نبذة عن معرض مسار العقاري
            </h2>
            <div className="mb-8 ml-auto h-1 w-24 bg-red-600"></div>
            <p className="text-lg font-medium">
              - معرض &quot;مسار&quot; هو أول معرض عقاري مصري يُقام أونلاين
              ويستهدف عملاءنا في المملكة العربية السعودية، ويجمع أهم شركات
              التطوير العقاري في مصر في مكان واحد – على موبايلك!
            </p>
            <p className="py-3 text-lg font-medium">
              - هدفنا هو توفير تجربة فريدة تقدر من خلالها تكتشف أفضل المشروعات،
              وتقارن بين العروض والأسعار، وتحجز وحدتك من غير ما تسافر أو تتحرك.
            </p>
            <p className="text-lg font-medium">
              - معرض مسار بيقدملك عروض حصرية، جلسات استشارية مباشرة، وفرص مميزة
              للاستثمار العقاري داخل مصر.
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
