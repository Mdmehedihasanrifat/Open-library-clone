// app/edit-book/[id].tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const EditBook: React.FC = () => {
    
  const [bookData, setBookData] = useState<any>(null);
  const router = useRouter();
  const { id } = useParams(); // Get the book ID from the URL

  useEffect(() => {
    const fetchBookData = async () => {
      const response = await fetch(`http://localhost:8000/api/books/${id}`);
      const data = await response.json();
      if (data) {
        setBookData(data[0]);
      } else {
        alert('Failed to fetch book data');
      }
    };
    if (id) fetchBookData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        alert('Book updated successfully');
        router.push('/liked-books'); // Redirect to the user's book list or any other page
      } else {
        const errorData = await response.json();
        alert(`Failed to update book: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

//   if (!bookData) return <div>Loading...</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookData((prevData:any) => ({
          ...prevData,
          coverImage: reader.result as string, // Store the base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const trimmedValue = value.trim(); // Remove any unwanted characters

    setBookData((prevData:any) => {
      const updatedGenres = checked
        ? [...prevData.genres, trimmedValue]
        : prevData.genres.filter((genre:any) => genre !== trimmedValue);

      return { ...prevData, genres: updatedGenres };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-0 sm:p-12">

    <div className='class="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl"'>
    <h1 className='text-2xl font-bold mb-8'>Edit Book</h1>
    {bookData && <form onSubmit={handleSubmit} className=''>
      <input type="text" name="title" value={bookData.title} onChange={handleChange} placeholder="Title" className='pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200' required />
      <input type="number" name="rating" value={bookData.rating} onChange={handleChange} min="0" max="5" placeholder="Rating" />
      <input type="text" name="language" value={bookData.language} onChange={handleChange} placeholder="Language" required />
      <input type="number" name="pages" value={bookData.pages} onChange={handleChange} min="1" placeholder="Pages" required />
      <input type="date" name="publish_date" value={bookData.publish_date} onChange={handleChange} placeholder="Publish Date" required />
      <input type="number" name="num_ratings" value={bookData.num_ratings} onChange={handleChange} min="0" placeholder="Number of Ratings" />
      <input type="number" name="price" value={bookData.price} onChange={handleChange} min="0" placeholder="Price ($)" required />
      {/* <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} required /> */}
      <textarea name="description_text" value={bookData.description_text} onChange={handleChange} placeholder="Description" required />
      <input type="text" name="author" value={bookData.author} onChange={handleChange} placeholder="Author" required />
      <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} placeholder="Publisher" required />

      {/* Genre Checkboxes */}
      {/* <h4>Select Genres</h4>
      {['Fiction', 'Fantasy', 'Young Adult', 'Science Fiction'].map((genre) => (
        <label key={genre}>
          <input
            type="checkbox"
            value={genre}
            checked={bookData.genres.includes(genre)}
            onChange={handleGenreChange}
          />
          {genre}
        </label>
      ))} */}
      <button type="submit" className='bg-blue-500 p-2 m-2'>Update Book</button>
    </form>}
    </div>
    </div>
  );
};

export default EditBook;
