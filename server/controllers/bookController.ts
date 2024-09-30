// controllers/bookController.ts
import { Request, Response } from 'express';
import pool from '../models/db';
import { convertToObject } from 'typescript';

// type user = {
//   id: number,
//   email: string,
//   username: string
// }
// Get books based on search, category, or both, with user like status

export const getBooks = async (req: Request, res: Response) => {
  const { category, search, offset = 0, limit = 10 } = req.query;

  try {
    let booksQuery = `
      SELECT books.book_id, books.title, books.cover_img, books.like_count
      FROM books
    `;
    
    let conditions: string[] = [];
    let params: any[] = [];

    // If category is provided, join with genres and filter by category
    if (category && typeof category === 'string') {
      booksQuery += ` JOIN book_genre ON books.book_id = book_genre.book_id
                      JOIN genres ON book_genre.genre_id = genres.genre_id`;
      conditions.push(`genres.genre_name = $${params.length + 1}`);
      params.push(category);
    }

    // If search term is provided, filter by title
    if (search && typeof search === 'string') {
      conditions.push(`LOWER(books.title) LIKE $${params.length + 1}`);
      params.push(`%${search.toLowerCase()}%`);
    }

    // Add conditions to the query
    if (conditions.length > 0) {
      booksQuery += ` WHERE ` + conditions.join(' AND ');
    }

    // Add limit and offset to the query
    booksQuery += ` ORDER BY books.book_id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string, 10), parseInt(offset as string, 10));

    const booksResponse = await pool.query(booksQuery, params);

    res.status(200).json(booksResponse.rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookById = async (req:Request, res: Response) => {
  const {id} = req.params
  try {
    const query= `
    SELECT * FROM books
    WHERE book_id = ${id};`

    const bookResponse = await pool.query(query)
    res.status(200).json(bookResponse.rows)
  } catch (error) {
    console.error('Error fetching book:', error)
    res.status(500).json({ message: 'Something is wrong'})
  }
};

export const getTrendingBooks = async (req: Request, res: Response) => {
  const { offset = 0, limit = 5 } = req.query; // Support for pagination
  try {
    const trendingBooks = await pool.query(
      `SELECT * FROM books ORDER BY like_count DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.status(200).json(trendingBooks.rows);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
export const getGenres = async (req: Request, res: Response) => {
  try {
    const genresQuery = `
      SELECT genre_name FROM genres

    `;
    const genresResponse = await pool.query(genresQuery);
    res.status(200).json(genresResponse.rows);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

import fs from 'fs';
import path from 'path';

export const postBooks = async (req: Request, res: Response) => {
  const { title, rating, language, pages, publish_date, num_ratings, coverImage, price, author, description_text, publisher, genres } = req.body;
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    // Decode the base64 image and save it
    const base64Image = coverImage.split(';base64,').pop();
// Correct path: This saves the file in the public/uploads folder
    const coverImgFilename = `${title}-${Date.now()}.jpg`;
    const coverImgPath = path.join(__dirname, "../../public/uploads", coverImgFilename);

    if (base64Image) {
      fs.writeFileSync(coverImgPath, base64Image, { encoding: 'base64' });
    }
    const dbCoverImgPath = `/images/${coverImgFilename}`;
    console.log("Database image path:", dbCoverImgPath)
    // Insert the book into the database
    const lastBookId = await pool.query(`SELECT book_id FROM books ORDER BY book_id DESC LIMIT 1;`);
    const bookId = lastBookId.rows[0].book_id + 1;

    const newBookResponse = await pool.query(
      `INSERT INTO books (book_id, title, rating, language, pages, publish_date, num_ratings, cover_img, price, author, description_text, publisher, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [bookId, title, rating, language, pages, publish_date, num_ratings, dbCoverImgPath, price, author, description_text, publisher, userId]
    );

    const newBook = newBookResponse.rows[0];

    // Insert selected genres into book_genre table
    for (const genre of genres) {
      const genreResponse = await pool.query(`SELECT genre_id FROM genres WHERE genre_name = $1`, [genre.trim()]);
      if (genreResponse.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: `Genre not found: ${genre}`,
        });
      }
      const genreId = genreResponse.rows[0].genre_id;
      await pool.query(`INSERT INTO book_genre (book_id, genre_id) VALUES ($1, $2)`, [bookId, genreId]);
    }

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: newBook,
    });
  } catch (error:any) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const likeOrDislikeBook = async (req: Request, res: Response) => {
  interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        [key: string]: any;
    };
}
  const { bookId } = req.params;
  const user = (req as AuthenticatedRequest).user; 
  console.log("userid===", user)
  const { like } = req.body; // Expecting { like: boolean }

  if (!user?.userId) {
    return res.status(401).json({ message: 'User ID not found' });
  }
  const userId = user.userId;

  try {
    // Check if the user already interacted with the book
    const checkInteractionQuery = `
      SELECT * FROM interactions WHERE book_id = $1 AND user_id = $2;
    `;
    const interactionResult = await pool.query(checkInteractionQuery, [bookId, userId]);

    if (interactionResult.rows.length > 0) {
      // If the user already liked the book and wants to unlike it, remove the entry
      if (!like) {
        // Bandage solution used here for the like counter bug i faced, the bug was the like counter incresed by 2 everytime loke button was clicked
        
        const deleteInteractionQuery = `
        DELETE FROM interactions WHERE book_id = $1 AND user_id = $2;
        `;
        await pool.query(deleteInteractionQuery, [bookId, userId]);
        
        // Decrease the like count
        const decreaseLikeQuery = `
          UPDATE books SET like_count = like_count - 2 WHERE book_id = $1;
        `;
        await pool.query(decreaseLikeQuery, [bookId]);

        return res.status(200).json({ message: 'Book unliked successfully' });
      }
    } else {
      // If the user is liking the book, create a new interaction and increase the like count
      if (like) {
        const insertInteractionQuery = `
          INSERT INTO interactions (user_id, book_id, "like") VALUES ($1, $2, true);
        `;
        await pool.query(insertInteractionQuery, [userId, bookId]);

        const increaseLikeQuery = `
          UPDATE books SET like_count = like_count + 1 WHERE book_id = $1;
        `;
        await pool.query(increaseLikeQuery, [bookId]);

        return res.status(200).json({ message: 'Book liked successfully' });
      }
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    console.error('Error liking/disliking book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Liked Books by a User
// export const getLikedBooks = async (req: Request, res: Response) => {
//   interface AuthenticatedRequest extends Request {
//     user?: {
//         id: number;
//         [key: string]: any;
//     };
// }
//   const user = (req as AuthenticatedRequest).user;
//   console.log("userID ====", user)

//   if (!user?.user_id) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   const userId = user.user_id;


//   try {
//     const likedBooksQuery = `
//       SELECT b.book_id, b.title, b.cover_img, b.author, b.like_count
//       FROM books b
//       LEFT JOIN interactions i ON b.book_id = i.book_id
//       WHERE i.user_id = $1 AND i."like" = true;
//     `;
//     const likedBooksResult = await pool.query(likedBooksQuery, [userId]);
//     console.log("REsult of liked books query",likedBooksResult)

//     res.status(200).json(likedBooksResult.rows);
//   } catch (error) {
//     console.error('Error fetching liked books:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Get All Liked Books by a User
export const getLikedBooks = async (req: Request, res: Response) => {

  console.log("get liked books Route hit")
  interface AuthenticatedRequest extends Request {
    user?: {
      id: number; // Change to match the correct key in your JWT middleware
      [key: string]: any;
    };
  }

  const user = (req as AuthenticatedRequest).user;

  // Ensure user exists and has an ID
  if (!user || !user.userId) { 
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }
  const userId = user.userId;  // Access the user ID correctly from JWT

  try {
    const likedBooksQuery = `
    SELECT b.book_id, b.title, b.cover_img, b.author, b.like_count
    FROM books b
    LEFT JOIN interactions i ON b.book_id = i.book_id
    WHERE i.user_id = $1 AND i."like" = true;
    `;
    const likedBooksResult = await pool.query(likedBooksQuery, [userId]);

    // Return liked books
    return res.status(200).json(likedBooksResult.rows);
  } catch (error) {
    console.error('Error fetching liked books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function for fetching created books
export const getCreatedBooks = async (req: Request, res: Response) => {
  console.log("get created Books route hit")
  interface AuthenticatedRequest extends Request {
    user?: {
      id: number;
      [key: string]: any;
    };
  }

  const user = (req as AuthenticatedRequest).user;
  if (!user || !user.userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }

  try {
    const createdBooksQuery = `
      SELECT * FROM books
      WHERE user_id = $1;
    `;
    const createdBooksResult = await pool.query(createdBooksQuery, [user.userId]);

    return res.status(200).json(createdBooksResult.rows);
  } catch (error) {
    console.error('Error fetching created books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response) => {
  console.log("deletebook entered")
  const bookId = parseInt(req.params.id);
  console.log("bookId taken", bookId)
  interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        [key: string]: any;
    };
}
  // Get the user ID from the authenticated request
  // const userId = (req as AuthenticatedRequest).user?.id;
   // Assuming req.user is populated by your authentication middleware
  const userId = (req as AuthenticatedRequest).user?.userId
  console.log("userId initialised==", userId)
  try {
    // Check if the book belongs to the user
    const bookCheck = await pool.query(`SELECT user_id FROM books WHERE book_id = $1`, [bookId]);

    console.log("Bookcheck query sent==",bookCheck)
    
    if (bookCheck.rows.length === 0) {
      console.log("book not found")
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const bookOwnerId = bookCheck.rows[0].user_id;
    console.log("checking Book's creator == ", bookOwnerId)

    // Check if the logged-in user is the owner of the book
    if (parseInt(bookOwnerId) !== userId) {
      console.log("book id does not match with the current user id")
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this book' });
    }

    // Proceed to delete the book
    const response = await pool.query(`DELETE FROM books WHERE book_id = $1 RETURNING *`, [bookId]);
    
    return res.status(200).json({ success: true, message: 'Book deleted successfully' , deleted: response});
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'An unknown error occurred' });
  }
};

// In your bookController.ts

// Update a book
export const updateBook = async (req: Request, res: Response) => {
  console.log("entered updateBook")
  interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        [key: string]: any;
    };
  }

  const bookId = parseInt(req.params.id);
  console.log("bookID parsed", bookId)
  const { title, rating, language, pages, publish_date, num_ratings, price, author, description_text, publisher } = req.body;

  // Get the user ID from the authenticated request
  const userId = (req as AuthenticatedRequest).user?.id; // Assuming req.user is populated by your authentication middleware



  try {
    // Check if the book belongs to the user
    const bookCheck = await pool.query(`SELECT user_id FROM books WHERE book_id = $1`, [bookId]);
    
    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const bookOwnerId = bookCheck.rows[0].user_id;

    // Check if the logged-in user is the owner of the book
    if (bookOwnerId !== userId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this book' });
    }

    // Proceed to update the book
    const response = await pool.query(
      `UPDATE books SET title = $1, rating = $2, language = $3, pages = $4, publish_date = $5, num_ratings = $6, price = $7, author = $8, description_text = $9, publisher = $10 WHERE book_id = $11 RETURNING *`,
      [title, rating, language, pages, publish_date, num_ratings, price, author, description_text, publisher, bookId]
    );

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: response.rows[0],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'An unknown error occurred' });
  }
};



export const bookController = {
  getBooks,
  getLikedBooks,
  likeOrDislikeBook,
  getBookById,
  postBooks,
  getCreatedBooks,
  getGenres,
  updateBook,
  deleteBook,
  getTrendingBooks
};
