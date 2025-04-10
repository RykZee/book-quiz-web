"use client";

import { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import Link from "next/link";

interface SearchResult {
  cover_i: number;
  title: string;
  first_publish_year: number;
  author_name: [string];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = getCookie("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    } else {
      // Redirect to login if not authenticated
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authToken = getCookie("authToken");

      if (!authToken) {
        // Redirect to login if no auth token
        return;
      }

      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`,
        { method: "GET" },
      );
      // const response = await fetch(
      //   `http://localhost:8080/book/search?query=${encodeURIComponent(searchQuery)}`,
      //   {
      //     headers: {
      //       Authorization: authToken,
      //       "Content-Type": "application-json",
      //     },
      //     method: "GET",
      //   },
      // );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
        setResults([]);
        return;
      }
      const data = await response.json();
      setResults(data.docs ?? []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Search</h1>
      <div className="flex">
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
          {results.map((result) => (
            <div key={result.cover_i} className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">{result.title}</h2>
              <p>
                <b>Author:</b> {result.author_name[0]} <b>Published:</b>{" "}
                {result.first_publish_year}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
