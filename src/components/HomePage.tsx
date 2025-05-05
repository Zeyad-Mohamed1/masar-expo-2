"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Developer } from "@prisma/client";
import { Loader2, Clock } from "lucide-react";

import DeveloperCard from "./DeveloperCard";
import BannerSection from "./BannerSection";
import VideoSection from "./VideoSection";

const HomePage = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [eventStarted, setEventStarted] = useState(false);
  const router = useRouter();
  // const { useCallCallingState, useParticipants } = useCallStateHooks();
  // const callingState = useCallCallingState();
  // const participants = useParticipants();

  // Set a hard-coded future date for the exhibition
  // May 9th, 2024 at 3:00 PM (local time)
  const targetDate = new Date(2024, 4, 9, 15, 0, 0);

  // Force the date to be in the future for testing
  if (targetDate <= new Date()) {
    // If the date is in the past, set it to 3 days from now for testing
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    futureDate.setHours(15, 0, 0, 0);
    targetDate.setTime(futureDate.getTime());
  }

  useEffect(() => {
    // Calculate time remaining
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Event has started
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setEventStarted(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
      setEventStarted(false); // Ensure event is not shown as started if there's time remaining
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Only fetch developers if event has started
    if (eventStarted) {
      fetchDevelopers();
    }

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [eventStarted]);

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

  const handleDeveloperClick = (name: string) => {
    router.push(`/developers/${name}`);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  // Render countdown timer
  const renderCountdown = () => {
    if (eventStarted) {
      return (
        <div className="mx-auto mb-8 max-w-3xl rounded-lg bg-green-50 p-6 text-center shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-green-700">
            المعرض قد بدأ!
          </h2>
          <p className="text-lg text-green-600">
            المعرض قد بدأ يوم الجمعة الموافق 9 مايو الساعة الثالثة عصرا بتوقيت
            القاهرة
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto mb-8 max-w-3xl rounded-lg bg-yellow-50 p-4 shadow-md">
        <div className="mb-3 flex items-center justify-center gap-2 text-lg font-bold text-yellow-700">
          <Clock className="h-5 w-5" />
          <span>المعرض سيبدأ قريباً</span>
        </div>
        <p className="mb-4 text-center text-gray-700">
          المعرض سيبدأ يوم الجمعة الموافق 9 مايو الساعة الثالثة عصرا بتوقيت
          القاهرة
        </p>
        <p className="mb-2 text-center text-2xl font-semibold text-gray-600 ">
          انتظرونا
        </p>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-md bg-white p-2 shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {timeRemaining.days}
            </div>
            <div className="text-xs text-gray-500">أيام</div>
          </div>
          <div className="rounded-md bg-white p-2 shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {timeRemaining.hours}
            </div>
            <div className="text-xs text-gray-500">ساعات</div>
          </div>
          <div className="rounded-md bg-white p-2 shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {timeRemaining.minutes}
            </div>
            <div className="text-xs text-gray-500">دقائق</div>
          </div>
          <div className="rounded-md bg-white p-2 shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {timeRemaining.seconds}
            </div>
            <div className="text-xs text-gray-500">ثواني</div>
          </div>
        </div>
      </div>
    );
  };

  // If event hasn't started and we're not showing developers, only show the countdown
  if (!eventStarted && !developers.length) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl">{renderCountdown()}</div>
      </div>
    );
  }

  if (loading && eventStarted) {
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
        {renderCountdown()}

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

      <VideoSection videoSrc="/video.mp4" />
    </>
  );
};

export default HomePage;
