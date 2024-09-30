// app/components/BookCard.tsx
// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// interface BookCardProps {
//   book: {
//     book_id: number;
//     title: string;
//     author: string;
//     cover_img: string;
//   };
// }

// const BookCard: React.FC<BookCardProps> = ({ book }) => {
//   return (
//     <div className="flex justify-center items-center">
//       <Link href={`/books/${book.book_id}`}>
//       <Image className='rounded-xl' src={book.cover_img} alt={book.title}/>
//       {/* <h3>{book.title}</h3>
//       <p>{book.author}</p> */}
//       {/* Link to the book details page */}
//         <p>View Details</p>
//       </Link>
//     </div>
//   );
// };

// export default BookCard;
// app/components/BookCard.tsx
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

interface BookCardProps {
  book: {
    book_id: number;
    title: string;
    author: string;
    cover_img: string;
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  console.log(book);
  const router = useRouter();
  const handleClick = async (id: Number) => {
    router.push(`/books/${id}`);
  };
  const basePath = "/Users/farhanaamin/Desktop/backend/public/uploads";
  const newBaseUrl = "http://localhost:8000/images";

  // const formattedImagePath = coverImg.replace(basePath, newBaseUrl)
  return (
    <div className="flex justify-center items-center p-4">
      <Link href={`/books/${book.book_id}`}>
        <Image
          className="rounded-xl cursor-pointer h-auto"
          src={
            book.cover_img.includes("https:")
              ? book.cover_img
              : `${newBaseUrl}/${book.cover_img.split('/').pop()}` // Extracts the filename and combines it with the base URL
          }
          alt={book.title}
          width={150}
          height={200}
          onClick={() => handleClick(book.book_id)}
        />

        <h3 className="text-xl font-bold">{book.title}</h3>
      </Link>
      <div className="ml-4">
        <p className="text-gray-600">{book.author}</p>
        <Link href={`/books/${book.book_id}`}>
          <p className="text-blue-500 mt-2 cursor-pointer">View Details</p>
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
