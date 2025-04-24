"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { H1 } from "../../components/typography";

type Book = {
  id: string;
  volumeInfo: {
    authors: [string];
    description: string;
    imageLinks: {
      large: string;
      thumbnail: string;
    };
    publishedDate: string;
    title: string;
    industryIdentifiers: [{ type: string; identifier: string }];
  };
};

export default function Book() {
  const params = useParams();
  const bookId = params["book-id"] as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
  }>({
    loading: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(bookId)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch book: ${response.status}`);
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const generateQuiz = async () => {
    if (!book) return;

    setRequestStatus({
      loading: true,
      success: false,
      error: null,
    });

    try {
      const response = await fetch("https://example.com/api/books/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.[0] || "Unknown",
          action: "generate_quiz",
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      setRequestStatus({
        loading: false,
        success: true,
        error: null,
      });

      // You can handle the response data here if needed
    } catch (err) {
      console.error("Error sending request:", err);
      setRequestStatus({
        loading: false,
        success: false,
        error: "Failed to send request. Please try again later.",
      });
    }
  };

  const saveBook = async () => {
    if (!book) return;

    setRequestStatus({
      loading: true,
      success: false,
      error: null,
    });

    try {
      const authToken = getCookie("authToken") as string;
      const response = await fetch("http://localhost:8080/api/v1/saved-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors ?? ["Unknown"],
          publishedDate: book.volumeInfo.publishedDate ?? "Unknown",
          isbn10:
            book.volumeInfo.industryIdentifiers.find((identifier) => identifier.type === "ISBN_10")
              ?.identifier ?? "Unknown",
          isbn13:
            book.volumeInfo.industryIdentifiers.find((identifier) => identifier.type === "ISBN_13")
              ?.identifier ?? "Unknown",
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      setRequestStatus({
        loading: false,
        success: true,
        error: null,
      });
    } catch (err) {
      console.error("Error sending request:", err);
      setRequestStatus({
        loading: false,
        success: false,
        error: "Failed to send request. Please try again later.",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg text-red-500">{error || "Book not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full shadow-md rounded overflow-hidden">
            <Image
              src={
                book.volumeInfo.imageLinks?.large ??
                book.volumeInfo.imageLinks?.thumbnail ??
                "/placeholder-book.png"
              }
              alt={`Cover of ${book.volumeInfo.title}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-4">
            <button
              onClick={saveBook}
              disabled={requestStatus.loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {requestStatus.loading ? "Saving..." : "Save This Book"}
            </button>

            {requestStatus.success && (
              <p className="mt-2 text-green-600 text-sm text-center">Request successfully sent!</p>
            )}

            {requestStatus.error && (
              <p className="mt-2 text-red-600 text-sm text-center">{requestStatus.error}</p>
            )}
          </div>
          <div className="mt-4">
            <button
              onClick={generateQuiz}
              disabled={requestStatus.loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {requestStatus.loading ? "Processing..." : "Generate Quiz for This Book"}
            </button>

            {requestStatus.success && (
              <p className="mt-2 text-green-600 text-sm text-center">Request successfully sent!</p>
            )}

            {requestStatus.error && (
              <p className="mt-2 text-red-600 text-sm text-center">{requestStatus.error}</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <H1>{book.volumeInfo.title}</H1>

          <div className="mt-4">
            <p className="text-lg font-semibold">By {book.volumeInfo.authors?.[0] ?? "Unknown"}</p>
            <p className="text-gray-600">Published in {book.volumeInfo.publishedDate}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: book.volumeInfo.description ?? "No description is available",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
