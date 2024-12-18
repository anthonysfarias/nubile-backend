import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 *
 * @param {number} [userId] - The unique identifier of the user for whom the token is being generated.
 * @throws {Error} If the user ID is undefined.
 * @returns {string} A signed JWT with the user ID as payload, valid for 1 hour.
 */
const generateToken = (userId?: number): string => {
  if (userId === undefined) {
    throw new Error('User ID is required');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
};

export default generateToken;
