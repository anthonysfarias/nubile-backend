// userRoutes.ts
import express from 'express';
import { registerUser, authUser, authValidation } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/token-validation', authValidation);

// router.get('/profile', protect, (req: AuthRequest, res) => {
//   const userId = req.user?.id;

//   if (userId === undefined) {
//     return res.status(401).json({ message: 'User ID is missing' });
//   }

//   // Return the user's information and a new token
//   res.json({
//     message: 'Token is valid',
//     userId,
//   });
// });

export default router;

