import express from 'express';
import { getAuthUserById, getUserWithTransactions } from '../controllers/authRoutes.js';

const router = express.Router();

// Get user by ID
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await getAuthUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user with their transactions
router.get('/:userId/transactions', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await getUserWithTransactions(userId);
        
        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching user with transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;