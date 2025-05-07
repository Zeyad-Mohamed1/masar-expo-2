"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
    const router = useRouter();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto max-w-[90%] py-3">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
                        <Link href="/" className="mb-2 transition-transform hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="Masar Expo Logo"
                                width={120}
                                height={40}
                                className="h-auto w-auto"
                            />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
                        <h3 className="mb-3 text-base font-semibold text-red-500">روابط سريعة</h3>
                        <nav className="flex flex-col items-center justify-center space-y-2 h-full">
                            <Link
                                href="/"
                                className="text-sm text-gray-300 transition-all hover:text-white hover:underline hover:translate-x-1"
                            >
                                الرئيسية
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm text-gray-300 transition-all hover:text-white hover:underline hover:translate-x-1"
                            >
                                عن المعرض
                            </Link>
                        </nav>
                    </div>

                    {/* Join Button and Zoom Downloads */}
                    <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800/50 p-4 backdrop-blur-sm">
                        <div className="flex flex-col items-center space-y-4">
                            <button
                                onClick={() => router.push("/sign-in")}
                                className="w-full rounded-md bg-red-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg hover:scale-105"
                            >
                                انضم إلى المعرض
                            </button>
                            <div className="flex flex-col items-center space-y-2">
                                <p className="text-xs text-gray-400">تحميل تطبيق زووم</p>
                                <div className="flex w-full justify-center space-x-3 rtl:space-x-reverse">
                                    <a
                                        href="https://apps.apple.com/eg/app/zoom-workplace/id546505307"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-lg hover:scale-105"
                                    >
                                        <Image
                                            src="/assets/images/apple-logo.png"
                                            alt="Apple App Store"
                                            width={16}
                                            height={16}
                                            className="h-4 w-4"
                                        />
                                        iOS
                                    </a>
                                    <a
                                        href="https://play.google.com/store/apps/details?id=us.zoom.videomeetings"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-lg hover:scale-105"
                                    >
                                        <Image
                                            src="/assets/images/android-logo.png"
                                            alt="Google Play Store"
                                            width={16}
                                            height={16}
                                            className="h-4 w-4"
                                        />
                                        Android
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-4 border-t border-gray-800 pt-4 text-center text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} معرض مسار العقاري. جميع الحقوق محفوظة</p>
                </div>
            </div>
        </footer>
    );
} 