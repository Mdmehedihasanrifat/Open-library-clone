// express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // or whatever type your user ID is
        username?: string;
        email?: string;
      };
    }
  }
}
