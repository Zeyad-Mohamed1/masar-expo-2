"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Developer } from "@prisma/client";
import { Loader2 } from "lucide-react";

import DeveloperCard from "./DeveloperCard";
import BannerSection from "./BannerSection";
import VideoSection from "./VideoSection";

const HomePage = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const router = useRouter();
  // const { useCallCallingState, useParticipants } = useCallStateHooks();
  // const callingState = useCallCallingState();
  // const participants = useParticipants();

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("/api/developers");
        if (!response.ok) throw new Error("Failed to fetch developers");
        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const handleDeveloperClick = (name: string) => {
    router.push(`/developers/${name}`);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const visibleDevelopers = developers.slice(0, visibleCount);
  const hasMore = visibleCount < developers.length;

  return (
    <>
      <BannerSection />

      <div className="container mx-auto max-w-[90%] py-8">
        <h1 className="mb-6 text-center text-4xl font-bold text-black">
          مسار إكسبو
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-700">
          منصة لعرض مشاريع المطورين العقاريين
        </p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {visibleDevelopers.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              handleDeveloperClick={handleDeveloperClick}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleShowMore}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </div>

      <VideoSection
        title="نبذة سريعة عن قطر اكسبو"
        description="معرض قطار اكسبو 2025 على الأبواب، ولا نستطيع الانتظار لنقدم لكم عاماً آخر من الفرص الرائعة والعروض الاستثمارية التي لا مثيل لها. هذا العام سوف يكون أكبر وأفضل، مع مجموعة من المشاريع العقارية المتنوعة، وفرص التواصل وتبادل الخبرات والاطلاع على أحدث الاتجاهات والتقنيات في مجال العقارات"
        videoSrc="/video.mp4"
      />
    </>
  );
};

export default HomePage;
