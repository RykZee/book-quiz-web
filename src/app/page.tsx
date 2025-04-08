'use client';

import { useState } from 'react';

interface SearchResult {
  cover_i: number,
  title: string,
  first_publish_year: number,
  author_name: [string]
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`, {method: 'GET'});
      const data = await response.json();
      setResults(data.docs);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Search</h1>
      
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
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.cover_i} className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">{result.title}</h2>
              <p><b>Author:</b> {result.author_name[0]} <b>Published:</b> {result.first_publish_year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
