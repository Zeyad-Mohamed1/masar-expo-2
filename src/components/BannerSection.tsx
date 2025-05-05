"use client";

import { useState } from "react";
import { useLink } from "@/hooks/useLink";
import { Loader2, ExternalLink } from "lucide-react";
import VisitorDialog from "./VisitorDialog";

const BannerSection = () => {
  const { link, isLoading } = useLink();
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Video Background */}
      <div className="relative h-[70vh] w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

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
                <span className="rounded-lg bg-gradient-to-r from-red-600/80 to-red-500/60 px-4 py-1">
                  ٩ و ١٠ مايو
                </span>
              </p>
            </div>

            {/* Join Exhibition Button */}
            <div className="mt-8 flex justify-center">
              {isLoading ? (
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
