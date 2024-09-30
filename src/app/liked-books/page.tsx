
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import BookCard from '../components/BookCard';
// import Cookies from 'js-cookie';

// const LikedBooksPage: React.FC = () => {
//   const [likedBooks, setLikedBooks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');

//     if (!token) {
//       router.push('/login');
//       return;
//     }

//     // Fetch liked books
//     fetch('http://localhost:8000/api/liked', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setLikedBooks(data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//       });
//   }, [router]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!likedBooks.length) {
//     return <div>No books liked yet.</div>;
//   }

//   const handleUnlike = async (bookId: number) => {
//     const token = Cookies.get('token');

//     try {
//       const response = await fetch(`http://localhost:8000/api/books/${bookId}/like`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ like: false }), // To unlike the book
//       });

//       if (response.ok) {
//         setLikedBooks(likedBooks.filter(book => book.book_id !== bookId)); // Remove unliked book from the list
//       }
//     } catch (error) {
//       console.error('Error unliking book:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Your Liked Books</h2>
//       <div className="liked-books-list">
//         {likedBooks.map((book) => (
//           <div key={book.book_id}>
//             <BookCard book={book} />
//             <button onClick={() => handleUnlike(book.book_id)}>
//               Unlike
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LikedBooksPage;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BookCard from '../components/BookCard';
import Cookies from 'js-cookie';

const LikedBooksPage: React.FC = () => {
  const [likedBooks, setLikedBooks] = useState<any[]>([]);
  const [createdBooks, setCreatedBooks] = useState<any[]>([]); // New state for created books
  const [loadingLiked, setLoadingLiked] = useState(true);
  const [loadingCreated, setLoadingCreated] = useState(true);
  const router = useRouter();

  // Fetch liked books
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:8000/api/liked', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLikedBooks(data);
        setLoadingLiked(false);
      })
      .catch(() => {
        setLoadingLiked(false);
      });
  }, [router]);

  // Fetch created books by the user
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      return;
    }

    fetch('http://localhost:8000/api/created-books', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCreatedBooks(data);
        setLoadingCreated(false);
      })
      .catch(() => {
        setLoadingCreated(false);
      });
  }, []);

  // Handle unliking a book
  const handleUnlike = async (bookId: number) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like: false }),
      });

      if (response.ok) {
        setLikedBooks(likedBooks.filter((book) => book.book_id !== bookId));
      }
    } catch (error) {
      console.error('Error unliking book:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Liked Books</h2>
      {loadingLiked ? (
        <div>Loading your liked books...</div>
      ) : !likedBooks.length ? (
        <div>No books liked yet.</div>
      ) : (
        <div className="liked-books-list">
          {likedBooks.map((book) => (
            <div key={book.book_id} className="mb-4">
              <BookCard book={book} />
              <button
                onClick={() => handleUnlike(book.book_id)}
                className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
              >
                Unlike
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Section for Created Books */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Books You Created</h2>
      {loadingCreated ? (
        <div>Loading your created books...</div>
      ) : !createdBooks.length ? (
        <div>No books created yet.</div>
      ) : (
        <div className="created-books-list">
          {createdBooks.map((book) => (
            <div key={book.book_id} className="mb-4">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedBooksPage;

