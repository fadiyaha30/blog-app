import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold">
          Your Site Name
        </Link>
        <div>
          {session ? (
            <>
              <Link href="/profile" className="text-white mr-4">
                Profile
              </Link>
              {/* Add logout button or other authenticated user options */}
            </>
          ) : (
            <Link href="/auth/login" className="text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}