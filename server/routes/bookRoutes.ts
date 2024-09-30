// routes/bookRoutes.ts
import express from 'express';
import { bookController,getGenres, getBookById, postBooks, likeOrDislikeBook, getLikedBooks , getCreatedBooks, updateBook, deleteBook, getTrendingBooks} from '../controllers/bookController';
import {authenticateJWT} from '../middlewares/authMiddleware'

const router = express.Router();

// Get books with optional search and category filtering, with user like status
router.get('/books', bookController.getBooks);
router.get('/genres', bookController.getGenres);

router.get('/books/:id', bookController.getBookById)
router.post('/create', authenticateJWT, bookController.postBooks)
// Route to like or dislike a book
router.post('/books/:bookId/like', authenticateJWT, bookController.likeOrDislikeBook);

// Route to get all liked books for a user
router.get('/liked', authenticateJWT, bookController.getLikedBooks);

// In your routes file, add the following endpoint
router.put('/books/:id', authenticateJWT, bookController.updateBook);

// In your routes file, add the following endpoint
router.delete('/books/:id', authenticateJWT, bookController.deleteBook);

// route to get created books for a user
router.get('/created-books', authenticateJWT, bookController.getCreatedBooks);
// Like or dislike a book
// router.post('/books/like', bookController.likeOrDislikeBook);
// Example route: routes/books.ts
router.get('/trending', bookController.getTrendingBooks);
  

export default router;
