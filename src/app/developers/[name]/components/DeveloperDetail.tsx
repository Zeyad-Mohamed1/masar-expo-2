"use client";

import Image from "next/image";
import { Developer } from "@prisma/client";
import {
  Phone,
  MapPin,
  HomeIcon,
  Tag,
  ExternalLink,
  Loader2,
} from "lucide-react";
import LiveUserCount from "./LiveUserCount";
import { useLink } from "@/hooks/useLink";
import { useState } from "react";
import VisitorDialog from "@/components/VisitorDialog";

interface DeveloperDetailProps {
  developer: Developer;
}

const DeveloperDetail = ({ developer }: DeveloperDetailProps) => {
  const { link, isLoading } = useLink();
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  return (
    <>
      <div className="container mx-auto max-w-[90%] py-8">
        {/* Custom styles for HTML content */}
        <style jsx global>{`
          .developer-long-description h1 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #1f2937;
          }
          .developer-long-description ul {
            list-style-type: disc;
            padding-right: 2rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
          }
          .developer-long-description li {
            margin-top: 0.5rem;
            color: #4b5563;
          }
        `}</style>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Developer profile card - Image and title */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="relative p-6">
              {/* Yellow accent bar */}

              <div className="flex flex-col items-center md:items-start">
                <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                  <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform hover:scale-105 md:mb-0">
                    {developer.logo ? (
                      <Image
                        src={developer.logo}
                        alt={developer.name}
                        width={144}
                        height={144}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-800 to-black text-white">
                        <HomeIcon className="h-12 w-12 opacity-70" />
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-right">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                      {developer.name}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                      <LiveUserCount developerName={developer.name} />
                    </div>
                    <p className="mt-4 text-gray-600">
                      {developer.shortDescription || "لا يوجد وصف موجز"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact information card */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="relative bg-gray-50 p-6">
              {/* Yellow accent bar */}

              <div className="mx-auto max-w-sm">
                <h3 className="mb-6 border-b border-gray-200 pb-2 text-center text-lg font-semibold text-gray-800">
                  معلومات الاتصال
                </h3>

                <div className="mb-5 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <Phone className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-xs text-gray-500">رقم الهاتف</div>
                    <a
                      href={`tel:${developer.phone}`}
                      className="font-medium text-gray-800 hover:text-red-600 transition-colors"
                    >
                      {developer.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  {isLoading && link ? (
                    <div className="flex h-12 w-48 items-center justify-center rounded-md bg-red-600 bg-opacity-90 text-white">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    link && (

                      <a
                        href="#"
                        onClick={handleJoinClick}
                        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 bg-opacity-90 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-opacity-100 hover:shadow-red-500/30"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          انضم الي المعرض
                          <ExternalLink className="h-5 w-5" />
                        </span>
                        <span className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-red-700 to-red-600 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
                      </a>

                    )
                  )}
                </div>
                <div className="mt-4">
                  <p className="mb-4 text-center text-lg font-medium text-gray-800">
                    تحميل تطبيق زووم للمشاركة في المعرض
                  </p>
                  <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
                    <a
                      href="https://apps.apple.com/eg/app/zoom-workplace/id546505307"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-200"
                    >
                      <Image
                        src="/assets/images/apple-logo.png"
                        alt="Apple App Store"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      تحميل زووم للايفون
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=us.zoom.videomeetings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-200"
                    >
                      <Image
                        src="/assets/images/android-logo.png"
                        alt="Google Play Store"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      تحميل زووم للاندرويد
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Long Description - Sticky on left side */}
          <div className="md:col-span-1">
            <div className="sticky top-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              {developer.longDescription ? (
                <div className="p-6">
                  <h2 className="mb-4 flex items-center rounded-lg bg-yellow-50 px-4 py-3 text-xl font-bold text-gray-900">
                    <Tag className="ml-2 h-5 w-5 text-yellow-600" />
                    <span>نبذة عن المطور</span>
                  </h2>
                  <div
                    className="developer-long-description text-right"
                    dangerouslySetInnerHTML={{
                      __html: developer.longDescription,
                    }}
                  />
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  لا يوجد وصف مفصل للمطور
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">معرض الصور</h2>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-gray-800">
                {developer.images.length} صورة
              </span>
            </div>

            {developer.images.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                <p className="text-center text-gray-500">لا توجد صور متاحة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {developer.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:border-yellow-400 hover:shadow-lg"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`${developer.name} - صورة ${index + 1}`}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Join Exhibition Button */}
        <div className="mt-8 flex justify-center md:hidden">
          {isLoading && link ? (
            <div className="flex h-12 w-48 items-center justify-center rounded-md bg-red-600 bg-opacity-90 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            link && (
              <a
                href="#"
                onClick={handleJoinClick}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-md bg-red-600 bg-opacity-90 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-opacity-100 hover:shadow-red-500/30"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  انضم الي المعرض
                  <ExternalLink className="h-5 w-5" />
                </span>
                <span className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-red-700 to-red-600 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
              </a>
            )
          )}
        </div>

        {/* Download Zoom App Buttons */}
        <div className="mt-10 md:hidden">
          <p className="mb-4 text-center text-lg font-medium text-gray-800">
            تحميل تطبيق زووم للمشاركة في المعرض
          </p>
          <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
            <a
              href="https://apps.apple.com/eg/app/zoom-workplace/id546505307"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-200"
            >
              <Image
                src="/assets/images/apple-logo.png"
                alt="Apple App Store"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              تحميل زووم للايفون
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=us.zoom.videomeetings"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-all hover:bg-gray-200"
            >
              <Image
                src="/assets/images/android-logo.png"
                alt="Google Play Store"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              تحميل زووم للاندرويد
            </a>
          </div>
        </div>
      </div>
      {/* Visitor Dialog */}
      <VisitorDialog
        isOpen={showDialog}
        targetUrl={link}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

export default DeveloperDetail;
