"use client";

import { Developer } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "react-hot-toast";
import axios from "axios";
import Editor from "@/components/mdx-editor";

interface DeveloperFormProps {
  developer?: Developer | null;
  onSubmit?: (formData: FormData) => Promise<void>;
}

export default function DeveloperForm({
  developer,
  onSubmit,
}: DeveloperFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(
    developer?.logo || null,
  );
  const [call, setCall] = useState<Call>();
  const [meetingId, setMeetingId] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Update meetingId when call changes
  useEffect(() => {
    if (call?.id) {
      setMeetingId(call.id);
    }
  }, [call]);

  const client = useStreamVideoClient();
  async function createMeeting() {
    if (!client) {
      return;
    }

    try {
      const id = crypto.randomUUID();
      const callType = "default";

      const call = client.call(callType, id);
      await call.getOrCreate();
      setCall(call);

      return call?.id;
    } catch (error) {
      console.error(error);
      toast.error("فشل في إنشاء معرف الاجتماع. حاول مرة أخرى.");
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setImageError("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      setImageError("نوع الملف غير مدعوم. استخدم JPEG, PNG, أو GIF");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearLogoPreview = () => {
    setPreviewLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);

    try {
      // Create meeting ID if not editing (for new developers only)
      let callId;
      if (!developer?.id) {
        callId = await createMeeting();
      }

      // Create FormData from the form
      const formData = new FormData(formRef.current);

      // Add the developer ID if editing
      if (developer?.id) {
        formData.append("id", developer.id);
      }

      // Add the call id as zoomId to formData if available
      if (callId) {
        formData.append("zoomId", callId);
        toast.success("تم إنشاء معرف الاجتماع بنجاح");
      } else if (developer?.zoomId) {
        // Keep existing zoomId if any
        formData.append("zoomId", developer.zoomId);
      }

      // If using the onSubmit prop, use it
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Otherwise use axios to submit to the API
        const url = developer?.id
          ? `/api/developers/${developer.id}`
          : "/api/developers";

        const method = developer?.id ? "PUT" : "POST";

        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(
            developer?.id ? "تم تحديث المطور بنجاح" : "تم إضافة المطور بنجاح",
          );
        } else {
          throw new Error(
            developer?.id
              ? "Failed to update developer"
              : "Failed to create developer",
          );
        }
      }

      router.push("/dashboard/developers");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium">
              شعار المطور
            </label>
            <div className="flex items-center gap-4">
              <div className="group relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-yellow-500">
                {previewLogo ? (
                  <>
                    <Image
                      src={previewLogo}
                      alt="Developer logo"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearLogoPreview}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-400">
                    <Upload className="h-8 w-8" />
                    <span className="mt-1 text-center text-xs">
                      اضغط لاختيار صورة
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="logo"
                  className="inline-flex cursor-pointer items-center rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  اختر صورة الشعار
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="mt-1 text-xs text-gray-500">
                  PNG، JPG، GIF بحد أقصى 2MB
                </p>
                {imageError && (
                  <p className="mt-1 text-xs text-red-500">{imageError}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              اسم المطور
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={developer?.name}
              placeholder="أدخل اسم المطور"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={developer?.email}
              placeholder="example@domain.com"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              رقم الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={developer?.phone}
              placeholder="966XXXXXXXXX"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="shortDescription"
              className="mb-2 block text-sm font-medium"
            >
              وصف مختصر
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              defaultValue={developer?.shortDescription || ""}
              placeholder="اكتب وصفًا مختصرًا عن المطور..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="longDescription"
              className="mb-2 block text-sm font-medium"
            >
              وصف مفصل
            </label>
            <div className="rounded-md border border-gray-300">
              <Editor
                value={developer?.longDescription || ""}
                onChange={(value) => {
                  // Create a hidden input to store the value for form submission
                  const input = document.createElement("input");
                  input.type = "hidden";
                  input.name = "longDescription";
                  input.value = value;

                  // Remove any existing hidden input
                  const existingInput = document.querySelector(
                    "input[name='longDescription']",
                  );
                  if (existingInput) {
                    existingInput.remove();
                  }

                  // Add the new input to the form
                  formRef.current?.appendChild(input);
                }}
              />
            </div>
          </div>

          {meetingId && (
            <div className="col-span-2 rounded-md bg-green-50 p-3 text-green-800">
              <input type="hidden" name="zoomId" value={meetingId} />
              <div className="flex items-center">
                <div className="mr-3 flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm">
                  تم إنشاء معرف الاجتماع:{" "}
                  <span className="font-mono font-medium">{meetingId}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-black transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="ml-2">جاري الحفظ...</span>
            </span>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>حفظ</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
