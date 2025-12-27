import { db } from '../../db';
import { subjects } from '../../db/schema';
import { inArray } from 'drizzle-orm';

export interface Subject {
    code: string;
    name: string;
}

export const getAllSubjects = async () => {
    return db.select().from(subjects);
};

export const createSubject = async (code: string, name: string) => {
    return db.insert(subjects).values({ code, name }).returning();
};

export const getSubjectsByCodes = async (codes: string[]) => {
    return db.select().from(subjects).where(inArray(subjects.code, codes));
};
