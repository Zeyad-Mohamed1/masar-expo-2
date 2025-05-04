import { useEffect } from "react";
import { usePageViewsStore } from "@/lib/store/pageViewsStore";
import { nanoid } from "nanoid";
import axios from "axios";

// Create a storage key for this specific developer
const getSessionStorageKey = (developerName: string) =>
  `developer_session_${developerName}`;

export function usePageViews(developerName: string) {
  const { developerViewers, setDeveloperViewers } = usePageViewsStore();

  useEffect(() => {
    // Generate or retrieve a persistent session ID for this developer page
    // This ensures the same user maintains the same ID when reloading
    const storageKey = getSessionStorageKey(developerName);
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = nanoid();
      sessionStorage.setItem(storageKey, sessionId);
    }

    // Function to fetch current count
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          `/api/page-views?developerName=${encodeURIComponent(developerName)}`,
        );
        setDeveloperViewers(developerName, response.data.count);
      } catch (error) {
        console.error("Error fetching page views:", error);
      }
    };

    // Register this user's presence
    const registerPresence = async () => {
      try {
        const response = await axios.post("/api/page-views", {
          developerName,
          sessionId,
          action: "enter",
        });
        setDeveloperViewers(developerName, response.data.count);
      } catch (error) {
        console.error("Error registering page view:", error);
      }
    };

    // Un-register this user when they leave
    const unregisterPresence = async () => {
      try {
        await axios.post("/api/page-views", {
          developerName,
          sessionId,
          action: "leave",
        });
      } catch (error) {
        console.error("Error unregistering page view:", error);
      }
    };

    // Function to handle page unload (browser close, tab close, navigation away)
    const handleBeforeUnload = () => {
      // Using sendBeacon for more reliable delivery when page is unloading
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          developerName,
          sessionId,
          action: "leave",
        });
        navigator.sendBeacon("/api/page-views", data);
      } else {
        // Fallback to synchronous XHR (less reliable but better than nothing)
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/page-views", false); // false for synchronous
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
          JSON.stringify({
            developerName,
            sessionId,
            action: "leave",
          }),
        );
      }
    };

    // Register presence when component mounts
    registerPresence();

    // Set up polling to get updated counts
    const intervalId = setInterval(fetchCount, 10000); // Poll every 10 seconds

    // Add beforeunload event listener for browser/tab close
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: unregister presence when component unmounts
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unregisterPresence();
    };
  }, [developerName, setDeveloperViewers]);

  return {
    viewerCount: developerViewers[developerName] || 0,
  };
}
