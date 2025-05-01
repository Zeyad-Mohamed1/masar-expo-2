import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-black py-10 shadow-md">
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          <Image
            src="/masar-expo logo_w.png"
            alt="مسار إكسبو"
            width={150}
            height={150}
            className="object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
