import { buttonClassName } from "@/components/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MeetingLoginPage() {
  return (
    <div className="mx-auto w-fit space-y-3">
      <h1 className="text-center text-2xl font-bold">Join meeting</h1>
      <Link
        href="#"
        className={cn(buttonClassName, "w-44 bg-gray-400 hover:bg-gray-500")}
        onClick={(e) => {
          e.preventDefault();
          // This link just triggers the verification flow which is handled in the parent component
        }}
      >
        Continue as guest
      </Link>
    </div>
  );
}
