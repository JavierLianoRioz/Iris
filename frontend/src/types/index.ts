export interface BackendSubject {
        code: string;
        name: string;
}

export interface FrontendSubject {
        id: string; // Maps to BackendSubject.code
        name: string;
        subscribed: boolean;
}

export interface User {
        name: string;
        email: string;
        picture: string;
        phone?: string;
        subjects?: BackendSubject[]; // Subjects as returned by the backend for the user
}

export interface UserSubscription {
        email: string;
        name: string;
        phone: string;
        subjects: string[]; // List of subject codes
}

export interface BackendUser {
        id: number;
        email: string;
        name: string;
        phone: string;
        subjects: BackendSubject[];
}
