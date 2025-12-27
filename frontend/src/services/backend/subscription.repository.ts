import { db } from '../../db';
import { users, userSubjects } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { getSubjectsByCodes, type Subject } from './subjects.repository';
import { assert } from '../../utils/assert';

export interface SubscriptionData {
    email: string;
    name?: string;
    phone?: string;
    subjectCodes: string[];
}

export interface UserResult {
    id: number;
    email: string;
    name: string | null;
    phone: string | null;
    subjects: Subject[];
}

export const subscribeUser = async (data: SubscriptionData): Promise<UserResult> => {
    const { email, name, phone, subjectCodes } = data;

    const existingSubjects = await getSubjectsByCodes(subjectCodes);
    
    assert(existingSubjects.length === subjectCodes.length, "One or more subjects not found");

    const resultUser = await db.transaction(async (tx) => {
        const [upsertedUser] = await tx.insert(users)
            .values({ email, name, phone })
            .onConflictDoUpdate({
                target: users.email,
                set: { name, phone } 
            })
            .returning();

        await tx.delete(userSubjects).where(eq(userSubjects.userId, upsertedUser.id));

        if (subjectCodes.length > 0) {
            await tx.insert(userSubjects).values(
                subjectCodes.map((code: string) => ({
                    userId: upsertedUser.id,
                    subjectCode: code
                }))
            );
        }

        return upsertedUser;
    });

    return {
        ...resultUser,
        subjects: existingSubjects as Subject[]
    };
};
