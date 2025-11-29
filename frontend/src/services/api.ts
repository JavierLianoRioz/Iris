const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface Subject {
    code: string;
    name: string;
}

interface UserSubscription {
    email: string;
    name: string;
    phone: string;
    subjects: string[]; // List of subject codes
}

interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    subjects: Subject[];
}

export const api = {
    getSubjects: async (): Promise<Subject[]> => {
        const response = await fetch(`${API_BASE_URL}/subjects`);
        if (!response.ok) {
            throw new Error(`Error fetching subjects: ${response.statusText}`);
        }
        return response.json();
    },

    updateSubscription: async (userSubscription: UserSubscription): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userSubscription),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error updating subscription: ${errorData.detail || response.statusText}`);
        }
        return response.json();
    },

    getUser: async (email: string): Promise<User | null> => {
        const response = await fetch(`${API_BASE_URL}/users/${email}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Error fetching user: ${response.statusText}`);
        }
        return response.json();
    },
};