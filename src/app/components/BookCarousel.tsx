'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

type BookCarouselProps = {
  category: string;
};

const BooksCarousel: React.FC<BookCarouselProps> = ({ category }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const itemsPerBatch = 5; // Number of books to display per batch

  // Function to fetch books with pagination support
  const fetchBooks = async (page: number) => {
    setLoading(true);
    const token = Cookies.get('token'); // Optional: If your API requires authentication
    let url = '';

    // Determine the correct URL based on the category
    if (category === 'trending') {
      // Use the trending endpoint for trending books
      url = `http://localhost:8000/api/trending?offset=${page * itemsPerBatch}&limit=${itemsPerBatch}`;
    } else if (category) {
      // Use the category-specific endpoint if a category is specified
      url = `http://localhost:8000/api/books?category=${category}&offset=${page * itemsPerBatch}&limit=${itemsPerBatch}`;
    } else {
      // Default to the general books endpoint for all books
      url = `http://localhost:8000/api/books?offset=${page * itemsPerBatch}&limit=${itemsPerBatch}`;
    }

    try {
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books whenever the category or current page changes
  useEffect(() => {
    fetchBooks(currentPage);
  }, [category, currentPage]);

  // Navigation handlers for pagination
  const nextBatch = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevBatch = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-2 flex justify-center items-center h-90">
      {/* Previous Button */}
      <button
        className="pt-5 pr-2 hover:opacity-75"
        onClick={prevBatch}
        disabled={currentPage === 0 || loading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1536 1536">
          <path
            fill="#4496c1"
            d="m909 1267l102-102q19-19 19-45t-19-45L704 768l307-307q19-19 19-45t-19-45L909 269q-19-19-45-19t-45 19L365 723q-19 19-19 45t19 45l454 454q19 19 45 19t45-19m627-499q0 209-103 385.5T1153.5 1433T768 1536t-385.5-103T103 1153.5T0 768t103-385.5T382.5 103T768 0t385.5 103T1433 382.5T1536 768"
          />
        </svg>
      </button>

      {/* Carousel Display */}
      <div className="flex items-center justify-center space-x-4">
        {loading ? (
          <div>Loading books...</div>
        ) : (
          books.map((book) => (
            <div key={book.book_id} className="book-card w-40 h-60">
              <Link href={`/books/${book.book_id}`}>
                <img
                  src={
                    book.cover_img.includes('https:')
                      ? book.cover_img
                      : `http://localhost:8000/images/${book.cover_img.split('/').pop()}`
                  }
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Next Button */}
      <button
        className="pt-5 pl-2 hover:opacity-75"
        onClick={nextBatch}
        disabled={loading || books.length < itemsPerBatch}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1536 1536">
          <g transform="translate(1536 0) scale(-1 1)">
            <path
              fill="#4496c1"
              d="m909 1267l102-102q19-19 19-45t-19-45L704 768l307-307q19-19 19-45t-19-45L909 269q-19-19-45-19t-45 19L365 723q-19 19-19 45t19 45l454 454q19 19 45 19t45-19m627-499q0 209-103 385.5T1153.5 1433T768 1536t-385.5-103T103 1153.5T0 768t103-385.5T382.5 103T768 0t385.5 103T1433 382.5T1536 768"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default BooksCarousel;
