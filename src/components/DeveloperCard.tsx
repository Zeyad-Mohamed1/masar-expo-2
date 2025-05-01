import { getToken } from "@/app/actions";
import useStreamCall from "@/hooks/useStreamCall";
import { Developer } from "@prisma/client";
import { StreamClient } from "@stream-io/node-sdk";
import {
  Call,
  StreamCall,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Mail, Phone, Eye, Building } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";

interface DeveloperCardProps {
  developer: Developer;
  handleDeveloperClick: (name: string) => void;
}

const DeveloperCard = ({
  developer,
  handleDeveloperClick,
}: DeveloperCardProps) => {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:border-yellow-500 hover:shadow-xl"
      onClick={() => handleDeveloperClick(developer.name)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        {developer.logo ? (
          <Image
            src={developer.logo}
            alt={developer.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400">
            <Building className="h-16 w-16 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <h2 className="mb-3 text-xl font-bold text-yellow-800">
          {developer.name}
        </h2>
        <div className="space-y-2">
          <p className="flex items-center text-sm text-gray-600">
            <Mail className="ml-2 h-4 w-4 text-yellow-600" />
            <span className="truncate">{developer.email}</span>
          </p>
          <p className="flex items-center text-sm text-gray-600">
            <Phone className="ml-2 h-4 w-4 text-yellow-600" />
            <span>{developer.phone}</span>
          </p>
          <p className="flex items-center text-sm text-gray-600">
            <Eye className="ml-2 h-4 w-4 text-yellow-600" />
            <span>عدد المشاهدات : {developer.count}</span>
          </p>
        </div>
        {developer.description && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="line-clamp-2 text-sm text-gray-600">
              {developer.description}
            </p>
          </div>
        )}
        <div className="mt-4 text-center">
          <span className="inline-block rounded-full bg-yellow-50 px-4 py-1 text-sm font-medium text-yellow-800 transition-colors group-hover:bg-yellow-100">
            عرض التفاصيل
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
