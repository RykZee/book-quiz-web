import { getCookie } from "cookies-next";
import { Book } from "@/types/book";
import { SetRequestStatus } from "@/types/requestStatus";

interface SaveBookProps {
  book: Book;
  setRequestStatus: SetRequestStatus;
}

export const saveBook = async ({ book, setRequestStatus }: SaveBookProps) => {
  if (!book) return;

  setRequestStatus({
    loading: true,
    success: false,
    error: null,
  });

  try {
    const response = await fetch("http://localhost:8080/api/v1/saved-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("authToken") as string,
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
