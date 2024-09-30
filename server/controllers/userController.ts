// src/controllers/userController.ts

// import { Request, Response } from 'express';
// import { getLikedBooks } from '../models/book';

// export const getBooksController = async (req: Request, res: Response) => {
//   const userId = (req as any).user.userId; // Extract user ID from JWT

//   try {
//     const likedBooks = await getLikedBooks(userId);
//     res.status(200).json(likedBooks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching liked books' });
//   }
// };
