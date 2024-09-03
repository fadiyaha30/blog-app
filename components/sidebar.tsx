import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 p-4 flex flex-col">
      <div className="mb-4">
        <Link href="/admin">
        <h2 className="text-lg font-bold">Admin Dashboard</h2>
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/admin/articles/create" className="hover:bg-gray-700 p-2 rounded block">
              Add New Article
            </Link>
          </li>
          <li>
            <Link href="/admin/categories/create" className="hover:bg-gray-700 p-2 rounded block">
              Add New Category
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="hover:bg-gray-700 p-2 rounded block">
              View All Categories
            </Link>
          </li>
          <li>
            <Link href="/admin/articles" className="hover:bg-gray-700 p-2 rounded block">
              View All Articles
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="hover:bg-gray-700 p-2 rounded block">
              Users Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;