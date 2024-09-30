import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface LikeDislikeProps {
  bookId: number;
  initialLikes: number; // Pass initial likes from the book data
}

const LikeDislike: React.FC<LikeDislikeProps> = ({ bookId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the user has already liked the book using Cookies
  useEffect(() => {
    const userLiked = Cookies.get(`liked-book-${bookId}`);
    if (userLiked === 'true') {
      setLiked(true);
    }
  }, [bookId]);

  const handleLike = async () => {
    const token = Cookies.get('token');
    
    if (!token) {
      setError('You need to be logged in to like a book.');
      return;
    }
    console.log("Token", token)

    try {
      // If the user hasn't liked the book, they will like it
      if (!liked) {
        const res = await fetch(`http://localhost:8000/api/books/${bookId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Assuming the token is stored in cookies
          },
          body: JSON.stringify({ like: true }), // Send like = true to like the book
        });

        if (res.status !== 200) throw new Error('Failed to like the book');

        const data = await res.json();
        setLikes(data.updatedLikes);
        setLiked(true);
        Cookies.set(`liked-book-${bookId}`, 'true'); // Mark this book as liked locally
      } 
      // If the user has already liked the book, they will unlike it
      else {
        const res = await fetch(`http://localhost:8000/api/books/${bookId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ like: false }), // Send like = false to unlike the book
        });

        if (!res.ok) throw new Error('Failed to unlike the book');

        const data = await res.json();
        setLikes(data.updatedLikes);
        setLiked(false);
        Cookies.set(`liked-book-${bookId}`, 'false'); // Mark this book as unliked locally
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded ${liked ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-gray-200 text-black hover:bg-blue-600'}`}
      >
        {liked ? 'Unlike' : 'Like'}
      </button>
      <span>{likes} Likes</span>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default LikeDislike;
