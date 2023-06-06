import { errorHandler } from './error.js';
import jwt from 'jsonwebtoken';

export const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json(errorHandler('User is not authorized'));
      }
      req.user = decoded;
      // console.log(req.user);
      console.log(req.user)
      next();
    });

    if (!token) {
      res
        .status(401)
        .json(errorHandler('User is not authorized or token is missing'));
    }
  }
};
