"use client";

import { useRef, useEffect, useState } from "react";
import { getWebsiteData } from "@/app/dashboard/actions";
import { websiteData } from "@prisma/client";
import Image from "next/image";

interface VideoSectionProps {
  videoSrc?: string;
  imageSrc?: string;
}

const VideoSection = ({ videoSrc, imageSrc }: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<websiteData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const websiteData = await getWebsiteData();
        setData(websiteData);
      } catch (error) {
        console.error("Failed to fetch website data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        setIsLoading(false);
        videoRef.current?.play().catch((error) => {
          console.error("Video autoplay failed:", error);
        });
      });
    }
  }, []);

  // Determine media source and type
  const mediaSource = data?.aboutImage || videoSrc || imageSrc || "";
  const isVideo =
    videoSrc ||
    mediaSource.includes(".mp4") ||
    mediaSource.includes(".webm") ||
    mediaSource.includes(".mov");

  return (
    <section className="py-24">
      {/* Custom styles for HTML content */}
      <style jsx global>{`
        .developer-long-description h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        .developer-long-description ul {
          list-style-type: disc;
          padding-right: 2rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .developer-long-description li {
          margin-top: 0.5rem;
          color: #4b5563;
        }
      `}</style>
      <div className="container mx-auto max-w-[90%]">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="p-8 text-right lg:p-12">
            <h2 className="mb-4 text-2xl font-bold">
              نبذة عن معرض مسار العقاري
            </h2>
            <div className="mb-8 ml-auto h-1 w-24 bg-red-600"></div>

            {data?.about ? (
              <div
                className="developer-long-description"
                dangerouslySetInnerHTML={{ __html: data.about }}
              />
            ) : (
              <ul>
                <li>
                  معرض &quot;مسار&quot; هو أول معرض عقاري مصري يُقام أونلاين
                  ويستهدف عملاءنا في المملكة العربية السعودية، ويجمع أهم شركات
                  التطوير العقاري في مصر في مكان واحد – على موبايلك!
                </li>
                <li>
                  هدفنا هو توفير تجربة فريدة تقدر من خلالها تكتشف أفضل
                  المشروعات، وتقارن بين العروض والأسعار، وتحجز وحدتك من غير ما
                  تسافر أو تتحرك.
                </li>
                <li>
                  معرض مسار بيقدملك عروض حصرية، جلسات استشارية مباشرة، وفرص
                  مميزة للاستثمار العقاري داخل مصر.
                </li>
              </ul>
            )}
          </div>
          <div className="relative h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-600"></div>
              </div>
            )}
            {mediaSource ? (
              <div className="relative h-full w-full">
                <Image
                  src={mediaSource}
                  alt="About section image"
                  fill
                  className="object-cover"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            ) : isVideo ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={mediaSource}
                muted
                loop
                playsInline
                controls
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <p>No media available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
