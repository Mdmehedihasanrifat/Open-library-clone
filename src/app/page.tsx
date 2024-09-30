'use client';
import React, { useEffect, useState } from 'react';
import BookCarousel from './components/BookCarousel';
import Nav from './components/navbar';

const HomePage: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [visibleGenres, setVisibleGenres] = useState<string[]>([]);
  const [loadCount, setLoadCount] = useState(1); // Number of categories to load initially after the first three sections
  const [showLoadMore, setShowLoadMore] = useState<boolean>(true); // Control for "Load More" button

  // Fetch genres from the backend
  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/genres');
      const data = await response.json();
      const genreNames = data.map((genre: { genre_name: string }) => genre.genre_name);
      setGenres(genreNames);
      // Set initial visible genres (only load one category initially)
      setVisibleGenres(genreNames.slice(0, 1));
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  // Fetch additional genres when the "Load More" button is clicked
  const loadMoreGenres = () => {
    const nextCount = Math.min(loadCount + 3, genres.length); // Load 3 more genres, or the remaining genres
    const additionalGenres = genres.slice(loadCount, nextCount);
    setVisibleGenres((prevGenres) => [...prevGenres, ...additionalGenres]);
    setLoadCount(nextCount);
    // Hide the "Load More" button if all genres are visible
    if (nextCount >= genres.length) setShowLoadMore(false);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <main>
      {/* Render All Books Carousel */}
      <section>
        <h2 className='text-center text-3xl font-bold my-5'>All Books</h2>
        <BookCarousel category='' />
      </section>

      {/* Trending Books Section */}
      {/* <section className='pt-10'>
        <h2 className='text-center text-3xl font-bold my-5'>Trending Books</h2>
        <BookCarousel category='trending' /> 
      </section> */}
      <h4 className='text-center text-3xl font-bold  mt-10'>Categories</h4>
      {/* Render the first visible category */}
      {visibleGenres.length > 0 && (
        <section className='pt-10'>
          <h2 className='text-center text-3xl font-bold my-5'>{visibleGenres[0]}</h2>
          <BookCarousel category={visibleGenres[0]} />
        </section>
      )}

      {/* Render additional genres loaded on demand */}
      {visibleGenres.slice(1).map((category) => (
        <section className='pt-10' key={category}>
          <h2 className='text-center text-3xl font-bold my-5'>{category}</h2>
          <BookCarousel category={category} />
        </section>
      ))}

      {/* Load More Button */}
      {showLoadMore && loadCount < genres.length && (
        <div className='text-center pt-5'>
          <button onClick={loadMoreGenres} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
            Load More Categories
          </button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
