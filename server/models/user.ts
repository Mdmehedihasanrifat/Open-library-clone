import pool from './db';
import bcrypt from 'bcryptjs';

export const findUserByEmail = async (email: string) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

export const createUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, hashedPassword]
  );
  return res.rows[0];
};
