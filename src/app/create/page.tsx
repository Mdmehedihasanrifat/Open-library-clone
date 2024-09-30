'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const CreateBookForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    rating: '',
    language: '',
    pages: '',
    publish_date: '',
    num_ratings: '',
    coverImage: '', // This will now store the base64 string
    price: '',
    author: '',
    description_text: '',
    publisher: '',
    genres: [] as string[], // Store selected genres
  });

  const router = useRouter();

  // Handle form change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle genres checkbox selection
  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const trimmedValue = value.trim(); // Remove any unwanted characters

    setFormData((prevData) => {
      const updatedGenres = checked
        ? [...prevData.genres, trimmedValue]
        : prevData.genres.filter((genre) => genre !== trimmedValue);

      return { ...prevData, genres: updatedGenres };
    });
  };

  // Handle file input change for the cover image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          coverImage: reader.result as string, // Store the base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  // Submit the form as JSON
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userCookie = Cookies.get("user");
    if (!userCookie) {
      alert("No user information found in cookies. Please login again.");
      return;
    }

    const user = JSON.parse(decodeURIComponent(userCookie));

    try {
      const response = await fetch('http://localhost:8000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'UserId': `${user.id}`,
        },
        body: JSON.stringify(formData), // Send the entire form data as JSON
      });

      if (response.ok) {
        // Redirect or handle success
        router.push('/liked-books');
      } else {
        const errorData = await response.json();
        console.error('Failed to create book', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
  <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create a New Book</h2>
  
  {/* Title Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">Title</label>
    <input
      type="text"
      name="title"
      value={formData.title}
      onChange={handleChange}
      placeholder="Enter the book title"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Rating Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="rating">Rating</label>
    <input
      type="number"
      name="rating"
      value={formData.rating}
      onChange={handleChange}
      min="0"
      max="5"
      placeholder="Rating"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Language Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="language">Language</label>
    <input
      type="text"
      name="language"
      value={formData.language}
      onChange={handleChange}
      placeholder="Enter the book's language"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Pages Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pages">Pages</label>
    <input
      type="number"
      name="pages"
      value={formData.pages}
      onChange={handleChange}
      min="1"
      placeholder="Number of pages"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Publish Date Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="publish_date">Publish Date</label>
    <input
      type="date"
      name="publish_date"
      value={formData.publish_date}
      onChange={handleChange}
      placeholder="Publish Date"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Number of Ratings Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="num_ratings">Number of Ratings</label>
    <input
      type="number"
      name="num_ratings"
      value={formData.num_ratings}
      onChange={handleChange}
      min="0"
      placeholder="Number of ratings"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Price Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">Price ($)</label>
    <input
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      min="0"
      placeholder="Price in USD"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Cover Image Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="coverImage">Cover Image</label>
    <input
      type="file"
      name="coverImage"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Description Textarea */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description_text">Description</label>
    <textarea
      name="description_text"
      value={formData.description_text}
      onChange={handleChange}
      placeholder="Write a brief description of the book"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    ></textarea>
  </div>

  {/* Author Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="author">Author</label>
    <input
      type="text"
      name="author"
      value={formData.author}
      onChange={handleChange}
      placeholder="Author's name"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Publisher Input */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="publisher">Publisher</label>
    <input
      type="text"
      name="publisher"
      value={formData.publisher}
      onChange={handleChange}
      placeholder="Publisher's name"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Genre Checkboxes */}
  <div className="mb-6">
    <h4 className="text-gray-700 text-sm font-medium mb-2">Select Genres</h4>
    <div className="flex gap-4">
      {['Fiction', 'Fantasy', 'Young Adult', 'Science Fiction'].map((genre) => (
        <label key={genre} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={genre}
            checked={formData.genres.includes(genre)}
            onChange={handleGenreChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700 text-sm">{genre}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
    >
      Create Book
    </button>
  </div>
</form>

  );
};

export default CreateBookForm;
