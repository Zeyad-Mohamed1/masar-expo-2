import { Mic, Webcam } from "lucide-react";

export default function PermissionPrompt() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <Webcam size={40} />
        <Mic size={40} />
      </div>
      <p className="text-center">
        يرجى السماح بالوصول إلى الميكروفون والكاميرا للانضمام إلى المكالمة
      </p>
    </div>
  );
}
