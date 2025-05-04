"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/Button";

interface GuestVerificationProps {
  meetingId: string;
}

export default function GuestVerification({
  meetingId,
}: GuestVerificationProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerification = async (
    visitorName: string,
    visitorPhone: string,
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/visitors/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: visitorName, phone: visitorPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Save to localStorage for future reference
      localStorage.setItem("visitorName", visitorName);
      localStorage.setItem("visitorPhone", visitorPhone);

      // Redirect to meeting page with guest mode
      router.replace(`/meeting/${meetingId}?guest=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify visitor");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      setError("Name and phone are required");
      return;
    }

    await handleVerification(name, phone);
  };

  return (
    <div className="mx-auto w-fit space-y-4 rounded-lg p-6 shadow-md">
      <h1 className="text-center text-2xl font-bold">أدخل بياناتك</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            الاسم
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="ادخل اسمك"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            رقم الهاتف
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="ادخل رقم الهاتف"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            buttonClassName,
            "w-full",
            isLoading && "cursor-not-allowed opacity-70",
          )}
        >
          {isLoading ? "يتم التحقق..." : "استمرار إلى الاجتماع"}
        </button>
      </form>
    </div>
  );
}
