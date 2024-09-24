// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import OAuthToken from '../models/OAuth/Token';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const oauthToken = await OAuthToken.findOne({ accessToken: token });

    if (!oauthToken) return res.status(401).send('Invalid token');

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

export default authMiddleware;
