import { notFound } from "next/navigation";
import Image from "next/image";
import { H1 } from "../../components/typography";

type Book = {
  id: string;
  volumeInfo: {
    authors: [string];
    description: string;
    imageLinks: {
      large: string;
    },
    publishedDate: string;
    title: string;
  }
};

async function getBookById(id: string): Promise<Book> {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching book data:", error);
    throw error;
  }
}

export default async function Book({ params }: { params: { "book-id": string } }) {
  const bookId = params["book-id"];
  let book: Book;

  try {
    book = await getBookById(bookId);
  } catch (error) {
    throw new Error(`Failed to load book with ID: ${bookId}`);
  }

  if (!book || !book.id) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full shadow-md rounded overflow-hidden">
            <Image
              src={book.volumeInfo.imageLinks.large}
              alt={`Cover of ${book.volumeInfo.title}`}
              fill
              className="object-cover"
              priority
            />
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
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }} />
            {/* <p className="text-gray-700">{book.volumeInfo.description}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
