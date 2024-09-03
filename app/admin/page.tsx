// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// const AdminPage = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   // if (!session || session.user.role !== "ADMIN") {
//   //   router.push("/");
//   //   return null;
//   // }

//   return (
//     <div className="container mx-auto p-4">
//       <Link
//         href="/"
//         className="text-blue-500 hover:underline mb-4 block"
//       >
//         ← Back to Home
//       </Link>
//       <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

//       <div className="flex space-x-4 mb-8 mt-6">
//         <Link
//           href="/admin/articles/create"
//           className="bg-blue-500 text-white px-4 py-2 rounded text-center"
//         >
//           Add New Article
//         </Link>
//         <Link
//           href="/admin/categories/create"
//           className="bg-green-500 text-white px-4 py-2 rounded text-center"
//         >
//           Add New Category
//         </Link>

//         <Link
//           href="/admin/categories"
//           className="bg-purple-500 text-white px-4 py-2 rounded text-center"
//         >
//           View All Categories
//         </Link>
//         <Link
//           href="/admin/articles"
//           className="bg-indigo-500 text-white px-4 py-2 rounded text-center"
//         >
//           View All Articles
//         </Link>
//         <Link
//           href="/admin/users"
//           className="bg-yellow-500 text-white px-4 py-2 rounded text-center"
//         >
//           Users Management
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  content: string;
  category: {
    name: string;
  };
  createdAt: string;
  imageUrl: string | null;
};

const ArticlesPage = () => {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link href={`/admin/articles/${article.id}`} key={article.id}>
            <div className="border border-gray-700 p-4 rounded hover:shadow-lg transition-shadow bg-gray-800">
              {article.imageUrl && (
                <div className="mb-4">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover w-full h-40"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2 text-white">
                {article.title}
              </h2>
              <p className="text-gray-400 mb-2">{article.category.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
