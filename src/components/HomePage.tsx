"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Developer } from "@prisma/client";
import { Loader2 } from "lucide-react";

import DeveloperCard from "./DeveloperCard";

const HomePage = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        المطورين العقاريين
      </h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {developers.map((developer) => (
          <DeveloperCard
            key={developer.id}
            developer={developer}
            handleDeveloperClick={handleDeveloperClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
