// import pool from './db';

// // Get all books
// export const getAllBooks = async () => {
//   const res = await pool.query('SELECT * FROM books');
//   return res.rows;
// };

// // Get a single book by ID
// export const getBookById = async (book_id: number) => {
//   const res = await pool.query('SELECT * FROM books WHERE book_id = $1', [book_id]);
//   return res.rows[0];
// };

// Like or dislike a book
// export const likeOrDislikeBook = async (user_id: number, book_id: number, like: boolean) => {
//   // Check if the user has already  this book
//   const interactionRes = await pool.query(
//     'SELECT * FROM interactions WHERE user_id = $1 AND book_id = $2',
//     [user_id, book_id]
//   );
  
//   const existingInteraction = interactionRes.rows[0];

//   if (existingInteraction) {
//     // If the user already interacted with the book, update the like status
//     if (existingInteraction.like !== like) {
//       await pool.query(
//         'UPDATE interactions SET "like" = $1 WHERE user_id = $2 AND book_id = $3',
//         [like, user_id, book_id]
//       );

//       const likeChange = like ? 1 : -1;
//       await pool.query(
//         'UPDATE books SET like_count = like_count + $1 WHERE book_id = $2',
//         [likeChange, book_id]
//       );

//       return { message: like ? 'Book ' : 'Book dis' };
//     } else {
//       return { message: like ? 'You already  this book' : 'You already dis this book' };
//     }
//   } else {
//     // If the user hasn't interacted with the book, insert a new like/dislike record
//     await pool.query(
//       'INSERT INTO interactions (user_id, book_id, "like") VALUES ($1, $2, $3)',
//       [user_id, book_id, like]
//     );

//     const likeChange = like ? 1 : -1;
//     await pool.query(
//       'UPDATE books SET like_count = like_count + $1 WHERE book_id = $2',
//       [likeChange, book_id]
//     );

//     return { message: like ? 'Book ' : 'Book dis' };
//   }
// };
// get books by categories
// export const getBooksByCategory = async (category: string, page: number, pageSize: number) => {
//     const limit = (page -1) * pageSize;
//     const res = await pool.query(`
//     SELECT 
//     b.book_id, 
//     b.title, 
//     b.author, 
//     b.cover_img, 
//     b.like_count, 
//     b.description_text,
//     b.rating,
//     b.pages,
//     b.language,
//     b.publish_date,
//     b.num_ratings,
//     b.price,
//     b.publisher,
//     b.created_at
//   FROM books b
//   JOIN book_genre bg ON b.book_id = bg.book_id
//   JOIN genres g ON bg.genre_id = g.genre_id
//   WHERE g.genre_name = $1
//   ORDER BY b.created_at DESC
//   LIMIT $2
//   OFFSET $3;
//     `, [category, limit, pageSize]);
    
//     return res.rows;
//   };

  // gets the  books
  // export const getBooks = async (user_id: number) => {
  //   const res = await pool.query(`
  //     SELECT b.*
  //     FROM books b
  //     JOIN interactions i ON b.book_id = i.book_id
  //     WHERE i.user_id = $1 AND i.like = true
  //   `, [user_id]);
  
  //   return res.rows;
  // };