"use client";

import { Developer } from "@prisma/client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, X, Plus } from "lucide-react";
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
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [developImages, setDevelopImages] = useState<string[]>(
    developer?.images || [],
  );
  const [replaceImages, setReplaceImages] = useState(false);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  // // Update meetingId when call changes
  // useEffect(() => {
  //   if (call?.id) {
  //     setMeetingId(call.id);
  //   }
  // }, [call]);

  // const client = useStreamVideoClient();
  // async function createMeeting() {
  //   if (!client) {
  //     return;
  //   }

  //   try {
  //     const id = crypto.randomUUID();
  //     const callType = "default";

  //     const call = client.call(callType, id);
  //     await call.getOrCreate();
  //     setCall(call);

  //     return call?.id;
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("فشل في إنشاء معرف الاجتماع. حاول مرة أخرى.");
  //   }
  // }

  // Compress image function with more aggressive compression
  const compressImage = (file: File, maxWidth = 800, quality = 0.5): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions if needed
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/jpeg', // Always convert to JPEG for better compression
            quality
          );
        };
        img.onerror = () => reject(new Error('Image loading error'));
      };
      reader.onerror = () => reject(new Error('FileReader error'));
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      setImageError("الملف المختار ليس صورة");
      return;
    }

    try {
      // Always compress images
      const compressedBlob = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(compressedBlob);
    } catch (error) {
      console.error("Error compressing image:", error);
      setImageError("حدث خطأ أثناء معالجة الصورة");
    }
  };

  const clearLogoPreview = () => {
    setPreviewLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageError("");

    if (!files || files.length === 0) return;

    // Check if total images will exceed limit
    if (developImages.length + files.length > 30) {
      setImageError("يمكنك رفع 30 صورة كحد أقصى");
      return;
    }

    // Process each file
    for (const file of Array.from(files)) {
      // Validate file is an image
      if (!file.type.startsWith("image/")) {
        setImageError("الملف المختار ليس صورة");
        continue;
      }

      try {
        // Always compress images
        const compressedBlob = await compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setDevelopImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error("Error compressing image:", error);
        setImageError("حدث خطأ أثناء معالجة الصورة");
      }
    }
    
    // Clear the file input to prevent duplicate uploads
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = developImages[index];
    setDevelopImages((prev) => prev.filter((_, i) => i !== index));

    // If it's an existing image (not a newly added base64 image), track it for removal
    if (imageToRemove && !imageToRemove.startsWith("data:")) {
      setRemovedImageUrls((prev) => [...prev, imageToRemove]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);

    try {
      // Create FormData from the form
      const formData = new FormData(formRef.current);

      // Add the developer ID if editing
      if (developer?.id) {
        formData.append("id", developer.id);
      }

      // Add the replaceImages flag
      formData.append("replaceImages", replaceImages.toString());

      // Deduplicate images
      const uniqueImages = [...new Set(developImages)];
      console.log(`Total unique images: ${uniqueImages.length}`);
      
      // Split images into existing ones and new ones (data URLs)
      const existingImages = uniqueImages.filter(img => !img.startsWith('data:'));
      const newImages = uniqueImages.filter(img => img.startsWith('data:'));
      
      console.log(`Existing images: ${existingImages.length}`);
      console.log(`New images: ${newImages.length}`);
      
      // Send the full images array including both existing and new
      formData.append("currentImages", JSON.stringify(uniqueImages));
      
      // Don't do any client-side conversion, send all images in the currentImages JSON
      // The server will extract the data URLs from currentImages

      // If using the onSubmit prop, use it
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Otherwise use axios to submit to the API
        const url = developer?.id
          ? `/api/developers/${developer.id}`
          : "/api/developers";

        const method = developer?.id ? "PUT" : "POST";

        console.log(`Submitting to ${url} with method ${method}`);
        console.log(`FormData has ${formData.getAll('currentImages').length} currentImages entries`);

        // Use chunked upload for large payloads
        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 120000, // Increase timeout to 2 minutes for larger uploads
        });

        console.log(`Response received with status: ${response.status}`);

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
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="mt-1 text-xs text-gray-500">
                  جميع أنواع الصور بحد أقصى 10MB
                </p>
                {imageError && (
                  <p className="mt-1 text-xs text-red-500">{imageError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium">صور المطور</label>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {developImages.map((image, index) => (
                  <div
                    key={index}
                    className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-300"
                  >
                    <Image
                      src={image}
                      alt={`Developer image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <label
                  htmlFor="images"
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-yellow-500"
                >
                  <Plus className="h-8 w-8 text-gray-400" />
                  <span className="mt-1 text-center text-xs text-gray-400">
                    إضافة صور
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={handleImagesChange}
                  multiple
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="inline-flex cursor-pointer items-center rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  اختر صور المطور
                </label>

                {developer?.images && developer.images.length > 0 && (
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={replaceImages}
                        onChange={(e) => setReplaceImages(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-yellow-600"
                      />
                      <span className="text-sm text-gray-600">
                        استبدال الصور الحالية
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">
                يمكنك رفع حتى 30 صورة بحجم أقصى 10MB للصورة الواحدة
              </p>
              {imageError && (
                <p className="text-xs text-red-500">{imageError}</p>
              )}
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
