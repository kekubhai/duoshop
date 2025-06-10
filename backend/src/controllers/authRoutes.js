import { sql } from '../config/db.js';



export async function createUser(userData){
    try{
   const { id, name, email, profile_image } = userData;

   const result=await sql`
   INSERT INTO users ()`
    }
    catch(error){
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}


export async function getAuthUserById(userID) {
    try {
        const result = await sql`
            SELECT * FROM users
            WHERE id = ${userID}
            LIMIT 1
        `;  
        if (result.length === 0) {
            return null; // User not found
        }
        return result[0];
    }
    catch(error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
    }
}

export async function getUserWithTransactions(userId) {
    try {
        // Get user data
        const user = await getAuthUserById(userId);
        
        if (!user) {
            return null;
        }
        
        // Get user's transactions
        const transactions = await sql`
            SELECT * FROM transactions
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;
        
        // Return combined data
        return {
            user,
            transactions
        };
    } catch (error) {
        console.error('Error fetching user with transactions:', error);
        throw new Error('Failed to fetch user with transactions');  
    }
}