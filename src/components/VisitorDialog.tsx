"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

interface VisitorDialogProps {
  isOpen: boolean;
  targetUrl: string | null;
  onClose: () => void;
}

export default function VisitorDialog({
  isOpen,
  targetUrl,
  onClose,
}: VisitorDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      setError("الاسم ورقم الهاتف مطلوبان");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/visitors/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ ما");
      }

      // Save to localStorage for future reference
      localStorage.setItem("visitorName", name);
      localStorage.setItem("visitorPhone", phone);

      // Navigate to target URL
      if (targetUrl) {
        window.open(targetUrl, "_blank");
      }

      // Close the dialog
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تسجيل الزائر");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            سجل بياناتك للانضمام
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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
              className="w-full rounded-md border p-2 text-right"
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
              className="w-full rounded-md border p-2 text-right"
              placeholder="ادخل رقم الهاتف"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">جاري التسجيل...</span>
                </div>
              ) : (
                "انضم الآن"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
