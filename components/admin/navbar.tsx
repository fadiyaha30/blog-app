import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold">
          Admin Dashboard
        </Link>
        <div className="space-x-4">
          <Link href="/admin/articles" className="hover:text-gray-300">
            Articles
          </Link>
          <Link href="/admin/categories" className="hover:text-gray-300">
            Categories
          </Link>
          <Link href="/admin/users" className="hover:text-gray-300">
            User Management
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;