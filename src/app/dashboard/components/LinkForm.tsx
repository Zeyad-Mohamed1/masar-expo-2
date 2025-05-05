"use client";

import { useState, useEffect } from "react";
import { getLink, upsertLink, deleteLink } from "../actions";
import { Loader2, Globe, Link as LinkIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const LinkForm = () => {
  const [url, setUrl] = useState("");
  const [currentLink, setCurrentLink] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      setIsLoading(true);
      try {
        const link = await getLink();
        if (link) {
          setCurrentLink(link);
          setUrl(link.url);
        }
      } catch (error) {
        console.error("Error fetching link:", error);
        toast.error("Failed to load link data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate URL
      if (!url.trim()) {
        toast.error("Please enter a valid URL");
        return;
      }

      // Add http:// prefix if not present
      let formattedUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`;
      }

      const updatedLink = await upsertLink(formattedUrl);
      setCurrentLink(updatedLink);
      setUrl(updatedLink.url);
      toast.success("Link updated successfully");
      setUrl("");
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error("Failed to update link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLink) return;

    if (!confirm("هل أنت متأكد من حذف هذا الرابط؟")) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteLink();
      setCurrentLink(null);
      setUrl("");
      toast.success("تم حذف الرابط بنجاح");
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("فشل في حذف الرابط");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-4">
        <Globe className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-800">رابط الدعوة</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              يمكنك إضافة رابط دعوة واحد فقط. إذا أضفت رابطًا جديدًا، سيتم
              استبدال الرابط القديم.
            </p>

            {currentLink && (
              <div className="mt-2 rounded-md bg-gray-50 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <a
                      href={currentLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-500 hover:underline"
                    >
                      {currentLink.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-md p-1 text-red-500 hover:bg-red-50"
                    aria-label="حذف الرابط"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label
                htmlFor="url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رابط الدعوة
              </label>
              <input
                type="text"
                id="url"
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="https://example.com/meeting/123"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSaving || isDeleting}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || isDeleting}
              className="flex items-center justify-center gap-2 rounded-md bg-yellow-500 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-600 disabled:bg-yellow-300"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                "حفظ الرابط"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default LinkForm;
