"use client";

import { useEffect, useState } from "react";
import { useLink } from "@/hooks/useLink";
import { Loader2, ExternalLink, Image as ImageIcon, Download } from "lucide-react";
import VisitorDialog from "./VisitorDialog";
import { getWebsiteData } from "@/app/dashboard/actions";
import Image from "next/image";

const BannerSection = () => {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ banner?: string | null } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { link, isLoading } = useLink();
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  useEffect(() => {
    setLoading(true);
    const fetchLink = async () => {
      try {
        const bannerData = await getWebsiteData();
        setBanner(bannerData as any);
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Still mark as "loaded" to remove loading state
  };

  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Background */}
      <div className="relative h-[70vh] w-full">
        {banner?.banner ? (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
            )}
            <Image
              src={banner.banner}
              alt="Banner image"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                imageLoaded && !imageError ? "opacity-100" : "opacity-0"
              }`}
              fill
              priority
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        )}

        {/* Fallback if image fails to load */}
        {imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <ImageIcon className="h-16 w-16 text-gray-400" />
            <p className="mt-4 text-gray-400">فشل تحميل الصورة</p>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="mx-auto text-center">
            <div className="mb-4 inline-block border-b-2 border-red-500 pb-1">
              <p className="text-xl font-medium tracking-wide text-white drop-shadow-md">
                نساعدك في اتخاذ أفضل قرار استثماري
              </p>
            </div>

            <div className="mb-6 flex flex-col items-center">
              <h2 className="text-center text-5xl font-bold tracking-tight drop-shadow-lg">
                <span className="relative">
                  <span className="relative z-10 text-white">
                    أهم معرض عقاري مصري
                  </span>
                  <span className="absolute -bottom-2 left-0 z-0 h-3 w-full bg-red-600/30"></span>
                </span>
              </h2>

              <p className="mt-8 text-center text-2xl font-medium tracking-wide drop-shadow-md">
                <span className="rounded-lg bg-gradient-to-r from-red-600/80 to-red-500/60 px-4 py-1 text-white">
                  ٩ و ١٠ مايو
                </span>
              </p>
            </div>

            {/* Join Exhibition Button */}
            <div className="mt-8 flex justify-center">
              {isLoading && link ? (
                <div className="flex h-12 w-48 items-center justify-center rounded-md bg-red-600 bg-opacity-90 text-white">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                link && (
                  <a
                    href="#"
                    onClick={handleJoinClick}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 bg-opacity-90 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-opacity-100 hover:shadow-red-500/30"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      انضم الي المعرض
                      <ExternalLink className="h-5 w-5" />
                    </span>
                    <span className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-red-700 to-red-600 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
                  </a>
                )
              )}
            </div>
            
            {/* Download Zoom App Buttons */}
            <div className="mt-10">
              <p className="mb-4 text-center text-lg font-medium text-white drop-shadow-md">
                تحميل تطبيق زووم للمشاركة في المعرض
              </p>
            <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">

              <a
                href="https://apps.apple.com/eg/app/zoom-workplace/id546505307"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Image 
                  src="/assets/images/apple-logo.png" 
                  alt="Apple App Store"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                تحميل زووم للايفون
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=us.zoom.videomeetings"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Image 
                  src="/assets/images/android-logo.png" 
                  alt="Google Play Store"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                تحميل زووم للاندرويد
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Dialog */}
      <VisitorDialog
        isOpen={showDialog}
        targetUrl={link}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
};

export default BannerSection;
