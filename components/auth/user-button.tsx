import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export const UserButton = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative group">
      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center">
        {session.user.name || session.user.email}
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Profile
        </Link>
        <button
          onClick={() => signOut()}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};