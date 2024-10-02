// src/app/books/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import LikeDislike from '@/app/components/Like';
import Cookies from 'js-cookie';
import { useUser } from '@/app/components/UserContext';
import Link from 'next/link';
import { cacheData } from '../../utils/cache';

type Book = {
  book_id: number;
  title: string;
  author: string | null;
  cover_img: string;
  description_text: string | null;
  publisher: string;
  pages: number;
  rating: string;
  num_ratings: number;
  price: string;
  language: string;
  publish_date: string;
  like_count: number;
  user_id: number | null;
};

const BookDetailsPage: React.FC = () => {
  const token = Cookies.get('token');
  const { user, setDeletedId } = useUser(); // Corrected way to access the user and setDeletedId
  const { id } = useParams(); // Get the book id from the route params
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter(); // Added router for navigation

  const handleDelete = async (book_id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/api/books/${book_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert('Book deleted successfully');
          setDeletedId(book_id); // Store the deleted book ID in the context
          router.push('/books'); // Redirect to books list
        } else {
          const errorData = await response.json();
          alert(`Failed to delete book: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      const response = await fetch(`http://localhost:8000/api/books/${id}`);
      return response.json();
    };

    // Provide an expiration time (e.g., 5 minutes = 300000 milliseconds)
    const cachedBook = cacheData(`book_${id}`, fetchBookDetails, 300000);

    cachedBook
      .then((data) => {
        if (data && data.length > 0) {
          setBook(data[0]); // Assuming the response is an array
        } else {
          // Handle the case where data is not found
          console.error('Book not found in cache or database');
        }
      })
      .catch(console.error);
  }, [id]);

  if (!book) {
    return <div className="text-center">Loading...</div>;
  }

  const basePath = "/Users/farhanaamin/Desktop/backend/public/uploads";
  const newBaseUrl = "http://localhost:8000/images/";

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-lg">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <Image
            src={book.cover_img.includes("https:") ? book.cover_img : book.cover_img.replace(basePath, newBaseUrl)}
            alt={book.title}
            width={300}
            height={400}
            className="rounded-lg"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
          <p className="text-lg mb-2"><strong>Author:</strong> {book.author}</p>
          <p className="text-lg mb-2"><strong>Publisher:</strong> {book.publisher}</p>
          <p className="text-lg mb-2"><strong>Pages:</strong> {book.pages}</p>
          <p className="text-lg mb-2"><strong>Language:</strong> {book.language}</p>
          <p className="text-lg mb-2"><strong>Rating:</strong> {book.rating} ({book.num_ratings} ratings)</p>
          <p className="text-lg mb-2"><strong>Price:</strong> ${book.price}</p>
          <p className="text-lg mb-4"><strong>Published on:</strong> {new Date(book.publish_date).toDateString()}</p>
          <p className="text-md mb-4">{book.description_text}</p>

          <LikeDislike bookId={book.book_id} initialLikes={book.like_count ? book.like_count : 0} />

          {parseInt(user?.id) === parseInt(book?.user_id) && (
            <div>
              <Link href={`/edit-books/${book.book_id}`}>
                <button className='bg-yellow-300 rounded m-2 p-2'>Edit</button>
              </Link>
              <button className='bg-red-600 rounded m-2 p-2' onClick={() => handleDelete(book.book_id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
