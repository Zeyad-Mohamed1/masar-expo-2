import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-center">
          <Link href="/" className="flex items-center">
            <div className="relative overflow-hidden rounded-b-lg  px-4 py-1 shadow-md transition-all duration-300">
              <Image
                src="/masar-expo logo_w.png"
                alt="مسار إكسبو"
                width={100}
                height={100}
                className="object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
