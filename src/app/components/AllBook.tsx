'use client';

import React, { useEffect, useState } from 'react';
import cacheData from "../utils/cache"
type BookCarouselProps = {
  category: string;
};

const BooksCarousel: React.FC<BookCarouselProps> = ({ category }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0); // Track current batch of books

  const itemsPerBatch = 5; // Number of books per batch

  useEffect(() => {
    // Fetch books from the backend
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/books?category=${category}`);
        const data = await response.json();
        setBooks(data);
        cacheData(`books_${category}`, fetchBooks).then(setBooks).catch(console.error);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
    console.log()
  }, [category]);

  // Calculate the current batch of books to display
  const startIndex = currentBatch * itemsPerBatch;
  const currentBooks = books.slice(startIndex, startIndex + itemsPerBatch);

  const nextBatch = () => {
    if (startIndex + itemsPerBatch < books.length) {
      setCurrentBatch(currentBatch + 1);
    }
  };

  const prevBatch = () => {
    if (currentBatch > 0) {
      setCurrentBatch(currentBatch - 1);
    }
  };
  
  return (
    <div className="p-2 flex justify-center items-center">
      <button
        className="pt-5 pr-2 hover:opacity-75"
        onClick={prevBatch}
        disabled={currentBatch === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1536 1536">
          <path fill="#4496c1" d="m909 1267l102-102q19-19 19-45t-19-45L704 768l307-307q19-19 19-45t-19-45L909 269q-19-19-45-19t-45 19L365 723q-19 19-19 45t19 45l454 454q19 19 45 19t45-19m627-499q0 209-103 385.5T1153.5 1433T768 1536t-385.5-103T103 1153.5T0 768t103-385.5T382.5 103T768 0t385.5 103T1433 382.5T1536 768"/>
        </svg>
      </button>


      <div className="flex items-center justify-center space-x-4">
        {currentBooks.map((book) => (
          <div key={book.book_id} className="book-card w-40 h-60">
            <img
              src={book.cover_img.includes("https:")?book.cover_img :"http://localhost:8000/"+book.cover_img}
              alt={book.title}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>

      <button
        className="pt-5 pl-2 hover:opacity-75"
        onClick={nextBatch}
        disabled={startIndex + itemsPerBatch >= books.length}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1536 1536">
          <g transform="translate(1536 0) scale(-1 1)">
            <path fill="#4496c1" d="m909 1267l102-102q19-19 19-45t-19-45L704 768l307-307q19-19 19-45t-19-45L909 269q-19-19-45-19t-45 19L365 723q-19 19-19 45t19 45l454 454q19 19 45 19t45-19m627-499q0 209-103 385.5T1153.5 1433T768 1536t-385.5-103T103 1153.5T0 768t103-385.5T382.5 103T768 0t385.5 103T1433 382.5T1536 768"/>
          </g>
        </svg>
      </button>

    </div>
  );
};

export default BooksCarousel;
