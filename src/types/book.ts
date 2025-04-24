export type Book = {
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
