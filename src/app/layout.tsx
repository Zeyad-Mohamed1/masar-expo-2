import Navbar from "@/components/Navbar";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProvider from "./ClientProvider";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meetings App",
  description: "A video calling app built with Next.js & Stream",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientProvider>
            <Navbar />
            <main className="mx-auto max-w-5xl px-3 py-6">{children}</main>
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
