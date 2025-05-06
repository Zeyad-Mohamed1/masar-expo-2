import Navbar from "@/components/Navbar";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ClientProvider from "./ClientProvider";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";
import Script from "next/script";

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
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TNTVNXCS');`}
      </Script>
      {/* End Google Tag Manager */}
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TNTVNXCS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AuthProvider>
          {/* <ClientProvider> */}
          <Navbar />
          {children}
          <Toaster position="top-center" />
          {/* </ClientProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
