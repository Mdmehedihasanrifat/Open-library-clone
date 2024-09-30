// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log("token===", token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    console.log("dd", decoded)
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
