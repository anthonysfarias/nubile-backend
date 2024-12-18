import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import pool from '../databases/databasePostgreeSQL';
import { verifyToken } from '../middlewares/authMiddleware';

/**
 * Registers a new user in the database.
 *
 * @param {Request} req - The request object with the email and password.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se o usuário já existe
    const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      client.release();
      return res.status(400).json({ message: 'User already exists' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o novo usuário no banco de dados
    const newUser = await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    client.release();

    res.status(201).json({
      id: newUser.rows[0].id,
      email: newUser.rows[0].email,
      token: generateToken(newUser.rows[0].id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

/**
 * Verifies a given JSON Web Token (JWT) for a user and returns a status
 * code of 1 if the token is valid, or 0 if the token is invalid.
 *
 * @param {Request} req - The request object with the JWT in the body.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const authValidation = async (req: Request, res: Response) => {
  const { token } = req.body;
  const refresh = verifyToken(token);

  if (refresh) {
    return res.status(200).json({ status: 1 });
  }

  return res.status(401).json({ status: 0 });
};

/**
 * Authenticates an existing user and returns a JSON Web Token (JWT) if the
 * credentials are valid.
 *
 * @param {Request} req - The request object with the email and password
 *   in the body.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the operation is
 *   complete.
 */
export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();

    // Verificar se o usuário existe
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    client.release();

    // Comparar a senha
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Database error', error });
  }
};
