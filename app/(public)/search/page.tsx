// app/(public)/search/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SearchResult = {
  id: string;
  title: string;
  createdAt: string;
  author: {
    name: string | null;
  } | null;
  category: {
    name: string;
  } | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Articles</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full p-2 border rounded text-black"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 ? (
        <ul>
          {results.map((article) => (
            <li key={article.id} className="mb-4">
              <Link
                href={`/articles/${article.id}`}
                className="text-blue-600 hover:underline"
              >
                <h2 className="text-3xl font-semibold text-white">{article.title}</h2>
              </Link>
              <p className="text-l text-white-600">
                By {article.author?.name || "Unknown"}
                {article.category && ` in ${article.category.name} `}
                on {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>{isLoading ? "Searching..." : "No results found"}</p>
      )}
    </div>
  );
}
