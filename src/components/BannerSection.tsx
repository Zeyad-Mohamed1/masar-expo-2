"use client";

import Link from "next/link";

const BannerSection = () => {
  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Video Background */}
      <div className="relative h-[500px] w-full">
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
        <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white md:pl-16 lg:pl-24">
          <div className="max-w-xl">
            <div className="mb-4 inline-block border-b-2 border-red-500 pb-1">
              <p className="text-xl font-medium tracking-wide text-white drop-shadow-md">
                نساعدك في اتخاذ أفضل قرار استثماري
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-left text-5xl font-bold tracking-tight drop-shadow-lg">
                <span className="relative">
                  <span className="relative z-10">أهم معرض عقاري مصري</span>
                  <span className="absolute -bottom-2 left-0 z-0 h-3 w-full bg-red-600/30"></span>
                </span>
              </h2>

              <p className="mt-8 text-right text-2xl font-medium tracking-wide drop-shadow-md">
                <span className="rounded-lg bg-gradient-to-r from-red-600/80 to-red-500/60 px-4 py-1">
                  ٩ و ١٠ مايو
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
