"use client";

import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import Link from "next/link";
// import { Text } from "./components/typography";
interface SearchResult {
  id: string;
  volumeInfo: {
    title: string;
    authors: [string];
    description: string;
    publishedDate: string;
  };
}
// interface SearchResult {
// 	cover_i: number;
// 	title: string;
// 	first_publish_year: number;
// 	author_name: [string];
// }

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = getCookie("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`,
        { method: "GET" }
      );

      // const response = await fetch(
      //   `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`,
      //   { method: "GET" },
      // );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
        setResults([]);
        return;
      }
      const data = await response.json();
      setResults(data.items ?? []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex">
        <Link href="/about" className="about-link">
          About
        </Link>
        {isAuthenticated ? (
          <button
            onClick={() => {
              deleteCookie("authToken");
              window.location.href = "/";
            }}
            className="logout-link"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="login-link">
            Sign in
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          {results
            .filter(
              (result: SearchResult) =>
                result.volumeInfo.title && Array.isArray(result.volumeInfo.authors)
            )
            .map((result: SearchResult) => (
              <div key={result.id} className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold">{result.volumeInfo.title}</h2>
                <p>
                  <p>{result.volumeInfo.description}</p>
                  <b>Author:</b> {result.volumeInfo.authors[0] ?? "Unknown"} <b>Published:</b>{" "}
                  {result.volumeInfo.publishedDate}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
