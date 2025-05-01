import { Developer } from "@prisma/client";
import { Mail, Phone, Eye, Building } from "lucide-react";
import Image from "next/image";

interface DeveloperCardProps {
  developer: Developer;
  handleDeveloperClick: (name: string) => void;
}

const DeveloperCard = ({
  developer,
  handleDeveloperClick,
}: DeveloperCardProps) => {
  return (
    <div className="group overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div
        className="relative h-44 w-full cursor-pointer overflow-hidden bg-gray-50"
        onClick={() => handleDeveloperClick(developer.name)}
      >
        {developer.logo ? (
          <Image
            src={developer.logo}
            alt={developer.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <Building className="h-14 w-14 text-base/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <h2
          onClick={() => handleDeveloperClick(developer.name)}
          className="mb-4 cursor-pointer border-r-4 border-base pr-2 text-lg font-semibold text-gray-900"
        >
          {developer.name}
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="h-4 w-4 text-base" />
            <span className="truncate">{developer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="h-4 w-4 text-base" />
            <span>{developer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Eye className="h-4 w-4 text-base" />
            <span>عدد الحضور : {developer.count}</span>
          </div>
        </div>
        <div className="mt-4 min-h-10 border-t border-gray-100 pt-4">
          <p className="line-clamp-2 text-sm text-gray-600">
            {developer.shortDescription || "لا يوجد وصف موجز"}
          </p>
        </div>
        <div className="mt-5">
          <button
            onClick={() => handleDeveloperClick(developer.name)}
            className="w-full cursor-pointer rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-base focus:ring-offset-1"
          >
            عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
