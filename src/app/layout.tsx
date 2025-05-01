import Navbar from "@/components/Navbar";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ClientProvider from "./ClientProvider";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";

export const metadata: Metadata = {
  title: "Masar-Expo",
  description: "مسار التجارة العقارية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <AuthProvider>
          <ClientProvider>
            <Navbar />
            <main className="mx-auto max-w-[90%]">{children}</main>
            <Toaster position="top-center" />
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
