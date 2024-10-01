'use client';

import React, { useState } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cache: { [key: string]: any[] } = {}; // Cache object

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      // Check if results are in cache
      if (cache[value]) {
        console.log('Using cached results:', cache[value]);
        setSearchResults(cache[value]);
        setIsDropdownOpen(true);
      } else {
        try {
          const response = await fetch(`http://localhost:8000/api/books?search=${value}`);
          
          // Ensure the response is okay
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();

          // Debugging: Log the data to see the structure
          console.log('Search Results:', data);
          
          // Update the search results based on the response structure
          setSearchResults(data || []); // Assuming data is an array
          cache[value] = data; // Store results in cache
          setIsDropdownOpen(true);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setIsDropdownOpen(false); // Close dropdown on error
        }
      }
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleResultClick = (bookId: number) => {
    console.log(`Selected Book ID: ${bookId}`);
    // Optionally navigate to the book details page here
    window.location.href = `/books/${bookId}`;
    
    setSearchTerm('');
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for books..."
        className="border rounded p-2"
      />
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1">
          {searchResults.map((book) => (
            <div
              key={book.book_id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleResultClick(book.book_id)}
            >
              <img src={book.cover_img} alt={book.title} className="inline-block w-10 h-10 mr-2" />
              {book.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
