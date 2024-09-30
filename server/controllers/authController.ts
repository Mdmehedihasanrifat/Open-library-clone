import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/user';
import dotenv from 'dotenv';
  

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = await createUser(username, email, password);

  const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '111h' });
  return res.status(201).cookie('jwt', token, {httpOnly: true, sameSite: 'strict'}).json({ token, user:{id:user.user_id,email:user.email,name:user.username} });
};
