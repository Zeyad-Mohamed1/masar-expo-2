import { useState, useEffect } from "react";

export function useLink() {
  const [link, setLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/link");
        if (!response.ok) throw new Error("Failed to fetch link");
        const data = await response.json();
        setLink(data?.url || null);
      } catch (error) {
        console.error("Error fetching link:", error);
        setLink(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, []);

  return { link, isLoading };
}
