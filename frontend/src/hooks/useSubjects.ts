import { useState, useEffect } from 'react';
import { getSubjects, type SubjectProto } from '../services/client/subjects.service';
import type { User } from '../types/user';

export interface FrontendSubject {
        id: string; 
        name: string;
        subscribed: boolean;
}

export const useSubjects = (user: User | null) => {
        const [allSubjects, setAllSubjects] = useState<SubjectProto[]>([]);
        const [subjects, setSubjects] = useState<FrontendSubject[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                const fetchSubjects = async () => {
                        try {
                                setIsLoading(true);
                                const fetchedSubjects = await getSubjects();
                                setAllSubjects(fetchedSubjects);
                                setError(null);
                        } catch (err) {
                                console.error(err);
                                setError("Failed to load subjects. Please try again.");
                        } finally {
                                setIsLoading(false);
                        }
                };
                fetchSubjects();
        }, []);

        useEffect(() => {
                if (allSubjects.length > 0) {
                        const userSubscribedCodes = new Set(user?.subjects?.map(s => s.code) || []);
                        const combinedSubjects: FrontendSubject[] = allSubjects.map(backendSub => ({
                                id: backendSub.code,
                                name: backendSub.name,
                                subscribed: userSubscribedCodes.has(backendSub.code),
                        }));
                        setSubjects(combinedSubjects);
                }
        }, [user, allSubjects]);

        const toggleSubject = (id: string) => {
                setSubjects(prevSubjects =>
                        prevSubjects.map(s =>
                                s.id === id ? { ...s, subscribed: !s.subscribed } : s
                        )
                );
        };

        return {
                subjects,
                isLoading,
                error,
                toggleSubject,
        };
};
