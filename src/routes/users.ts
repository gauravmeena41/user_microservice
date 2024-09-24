// src/routes/users.ts
import express, { Request, Response } from 'express';
import User from '../models/User';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Secure route example
// router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
//   const user = await User.findById(req.user._id);
//   res.json(user);
// });

export default router;
