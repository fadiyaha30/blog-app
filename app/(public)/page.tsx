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
            <Link href={`/articles/${article.id}`} key={article.id}>
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
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
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
