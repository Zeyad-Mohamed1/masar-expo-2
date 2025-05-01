import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-gradient-to-r from-yellow-500 to-yellow-900 px-6 py-4 shadow-md">
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          <Image
            src="/logo.png"
            alt="مسار إكسبو"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
