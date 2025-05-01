"use client";

import { Project, Developer } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, X, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ProjectWithDeveloper extends Project {
  developer: Developer;
}

interface ProjectFormProps {
  project?: ProjectWithDeveloper | null;
  onSubmit?: (formData: FormData) => Promise<void>;
}

export default function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(
    project?.images || [],
  );
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch developers for dropdown
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get("/api/developers");
        setDevelopers(response.data);
      } catch (error) {
        console.error("Error fetching developers:", error);
        toast.error("فشل في تحميل قائمة المطورين");
      }
    };

    fetchDevelopers();
  }, []);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageError("");

    if (files.length === 0) return;

    // Validate file size (2MB max per file)
    const oversizedFiles = files.filter((file) => file.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setImageError("حجم كل صورة يجب أن يكون أقل من 2MB");
      return;
    }

    // Validate file type
    const invalidFiles = files.filter(
      (file) => !file.type.match(/image\/(jpeg|jpg|png|gif)/),
    );
    if (invalidFiles.length > 0) {
      setImageError("بعض أنواع الملفات غير مدعومة. استخدم JPEG, PNG, أو GIF");
      return;
    }

    // Add new images to preview
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);

    try {
      // Create FormData from the form
      const formData = new FormData(formRef.current);

      // Add the project ID if editing
      if (project?.id) {
        formData.append("id", project.id);
      }

      // If using the onSubmit prop, use it
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Otherwise use axios to submit to the API
        const url = project?.id
          ? `/api/projects/${project.id}`
          : "/api/projects";

        const method = project?.id ? "PUT" : "POST";

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
            project?.id ? "تم تحديث المشروع بنجاح" : "تم إضافة المشروع بنجاح",
          );
        } else {
          throw new Error(
            project?.id
              ? "Failed to update project"
              : "Failed to create project",
          );
        }
      }

      router.push("/dashboard/projects");
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
              صور المشروع
            </label>
            <div className="flex flex-wrap gap-4">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-300"
                >
                  <Image
                    src={image}
                    alt={`Project image ${index + 1}`}
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
                  <input type="hidden" name={`existingImages`} value={image} />
                </div>
              ))}

              <div className="group relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-yellow-500">
                <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-400">
                  <Plus className="h-8 w-8" />
                  <span className="mt-1 text-center text-xs">إضافة صورة</span>
                </div>
                <input
                  type="file"
                  id="images"
                  name="images"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImagesChange}
                  multiple
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>
            {imageError && (
              <p className="mt-1 text-xs text-red-500">{imageError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              PNG، JPG، GIF بحد أقصى 2MB لكل صورة
            </p>
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              اسم المشروع
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={project?.name}
              placeholder="أدخل اسم المشروع"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label
              htmlFor="developerId"
              className="mb-2 block text-sm font-medium"
            >
              المطور العقاري
            </label>
            <select
              id="developerId"
              name="developerId"
              defaultValue={project?.developerId}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="" disabled>
                اختر المطور العقاري
              </option>
              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {developer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium"
            >
              الموقع
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={project?.location}
              placeholder="موقع المشروع"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="units" className="mb-2 block text-sm font-medium">
              عدد الوحدات
            </label>
            <input
              id="units"
              name="units"
              type="number"
              defaultValue={project?.units}
              placeholder="عدد الوحدات السكنية"
              required
              min="1"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              حالة المشروع
            </label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="" disabled>
                اختر حالة المشروع
              </option>
              <option value="تحت الإنشاء">تحت الإنشاء</option>
              <option value="مكتمل">مكتمل</option>
              <option value="متوقف">متوقف</option>
              <option value="قيد البيع">قيد البيع</option>
              <option value="تم البيع">تم البيع</option>
            </select>
          </div>

          <div className="col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              وصف المشروع
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={project?.description || ""}
              placeholder="اكتب وصفاً للمشروع هنا..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          disabled={isLoading}
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "جاري الحفظ..." : "حفظ المشروع"}
        </button>
      </div>
    </form>
  );
}
