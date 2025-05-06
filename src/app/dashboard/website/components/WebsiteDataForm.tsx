"use client";

import { websiteData } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Editor from "@/components/mdx-editor";
import { getWebsiteData } from "../../actions";

interface WebsiteDataFormProps {
  onSubmit?: (formData: FormData) => Promise<any>;
}

// Helper function to resize image and convert to base64
const resizeImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.7,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Get the data URL
          const dataUrl = canvas.toDataURL(file.type, quality);
          resolve(dataUrl);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
};

export default function WebsiteDataForm({
  onSubmit,
}: WebsiteDataFormProps) {
  const [websiteData, setWebsiteData] = useState<websiteData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const data = await getWebsiteData();
        if (data) {
          setWebsiteData(data);
          setPreviewBanner(data.banner || null);
          setPreviewAboutImage(data.aboutImage || null);
          setAboutText(data.about || "");
        }
      } catch (error) {
        console.error("Error fetching website data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setDataLoading(false);
      }
    };
    fetchWebsiteData();
  }, []);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [previewAboutImage, setPreviewAboutImage] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);

  // Used to store resized images
  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(null);
  const [aboutImageDataUrl, setAboutImageDataUrl] = useState<string | null>(null);

  // Handle banner image change
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setImageError("حجم الصورة يجب أن يكون أقل من 10 ميجابايت");
      return;
    }

    try {
      // Resize the image for banner (1200x600 is a good size for banners)
      const resizedImage = await resizeImage(file, 1200, 600, 0.7);
      setPreviewBanner(resizedImage);
      setBannerDataUrl(resizedImage);
    } catch (error) {
      console.error("Error resizing image:", error);
      setImageError("حدث خطأ أثناء معالجة الصورة");
    }
  };

  // Handle about image change
  const handleAboutImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setImageError("حجم الصورة يجب أن يكون أقل من 10 ميجابايت");
      return;
    }

    try {
      // Resize the image for about section (800x600 is good for content images)
      const resizedImage = await resizeImage(file, 800, 600, 0.7);
      setPreviewAboutImage(resizedImage);
      setAboutImageDataUrl(resizedImage);
    } catch (error) {
      console.error("Error resizing image:", error);
      setImageError("حدث خطأ أثناء معالجة الصورة");
    }
  };

  // Clear banner preview
  const clearBannerPreview = () => {
    setPreviewBanner(null);
    setBannerDataUrl(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  // Clear about image preview
  const clearAboutImagePreview = () => {
    setPreviewAboutImage(null);
    setAboutImageDataUrl(null);
    if (aboutImageInputRef.current) {
      aboutImageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);

    try {
      // Create FormData from the form
      const formData = new FormData();

      // Add the about text from the editor
      formData.append("about", aboutText);

      // Add the resized banner image if it exists
      if (bannerDataUrl) {
        formData.append("banner", bannerDataUrl);
      } else if (previewBanner && previewBanner === websiteData?.banner) {
        // Keep existing banner
        formData.append("keepExistingBanner", "true");
      }

      // Add the resized about image if it exists
      if (aboutImageDataUrl) {
        formData.append("aboutImage", aboutImageDataUrl);
      } else if (
        previewAboutImage &&
        previewAboutImage === websiteData?.aboutImage
      ) {
        // Keep existing about image
        formData.append("keepExistingAboutImage", "true");
      }

      // Call cleanup API first to ensure we only have one record
      await axios.post("/api/website/cleanup");

      // If using the onSubmit prop, use it
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Otherwise use axios to submit to the API
        const response = await axios({
          method: "PUT",
          url: "/api/website",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("تم تحديث بيانات الموقع بنجاح");
        } else {
          throw new Error("Failed to update website data");
        }
      }

      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          <p className="mt-2 text-sm text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-6">
          {/* Banner Image */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              صورة البانر الرئيسي
            </label>
            <div className="flex flex-col gap-4">
              <div className="group relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-yellow-500">
                {previewBanner ? (
                  <>
                    <Image
                      src={previewBanner}
                      alt="Banner image"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearBannerPreview}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-400">
                    <Upload className="h-10 w-10" />
                    <span className="mt-2 text-center text-sm">
                      اضغط لاختيار صورة البانر
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="banner"
                  className="inline-flex cursor-pointer items-center rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  اختر صورة البانر
                </label>
                <input
                  type="file"
                  id="banner"
                  name="banner"
                  ref={bannerInputRef}
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
                <p className="mt-1 text-xs text-gray-500">
                  يفضل استخدام صورة بأبعاد عريضة (نسبة 2:1 أو 3:1) بحد أقصى 10MB
                </p>
              </div>
            </div>
          </div>

          {/* About Image */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              صورة قسم &quot;من نحن&quot;
            </label>
            <div className="flex flex-col gap-4">
              <div className="group relative h-48 w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-yellow-500">
                {previewAboutImage ? (
                  <>
                    <Image
                      src={previewAboutImage}
                      alt="About image"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearAboutImagePreview}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-400">
                    <Upload className="h-10 w-10" />
                    <span className="mt-2 text-center text-sm">
                      اضغط لاختيار صورة قسم &quot;من نحن&quot;
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="aboutImage"
                  className="inline-flex cursor-pointer items-center rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  اختر صورة قسم &quot;من نحن&quot;
                </label>
                <input
                  type="file"
                  id="aboutImage"
                  name="aboutImage"
                  ref={aboutImageInputRef}
                  accept="image/*"
                  onChange={handleAboutImageChange}
                  className="hidden"
                />
                <p className="mt-1 text-xs text-gray-500">
                  جميع أنواع الصور بحد أقصى 10MB
                </p>
              </div>
            </div>
          </div>

          {imageError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {imageError}
            </div>
          )}

          {/* About Text */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              محتوى قسم &quot;من نحن&quot;
            </label>
            <div className="rounded-md border border-gray-300">
              <Editor value={aboutText} onChange={setAboutText} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              يمكنك إضافة نص منسق باستخدام أدوات التحرير
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </span>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              حفظ البيانات
            </>
          )}
        </button>
      </div>
    </form>
  );
}
