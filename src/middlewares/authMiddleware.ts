import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: number } | null;
}
/**
 * Verifies a JSON Web Token (JWT) using a secret key.
 *
 * @param {string} token - The JWT to be verified.
 * @returns {any} The decoded token if verification is successful; otherwise, returns false.
 * @throws No explicit exceptions are thrown; errors are caught and handled internally.
 */

export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded;
  } catch (error) {

    return false;
  }
};

/**
 * Protects a route by verifying a JSON Web Token (JWT) in the
 * 'Authorization' header. If the token is valid, the user's ID is
 * stored in the request object for further use. If the token is
 * invalid or missing, a 401 response is sent.
 *
 * @param {AuthRequest} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded as { id: number };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
