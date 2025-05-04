import { useEffect, useState } from "react";
import axios from "axios";

export function usePageViewsCount(developerName: string) {
  const [viewerCount, setViewerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch current count without registering presence
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/page-views?developerName=${encodeURIComponent(developerName)}`,
        );
        setViewerCount(response.data.count);
      } catch (error) {
        console.error("Error fetching page views:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchCount();

    // Set up polling to get updated counts
    const intervalId = setInterval(fetchCount, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [developerName]);

  return {
    viewerCount,
    isLoading,
  };
}
