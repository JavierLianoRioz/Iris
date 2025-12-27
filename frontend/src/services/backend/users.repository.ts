import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const getUserByEmail = async (email: string) => {
    return db.query.users.findFirst({
        where: eq(users.email, email),
        with: {
            subjects: {
                with: {
                    subject: true
                }
            }
        }
    });
};

export const deleteUserByEmail = async (email: string): Promise<boolean> => {
    const result = await db.delete(users).where(eq(users.email, email)).returning();
    return result.length > 0;
};
