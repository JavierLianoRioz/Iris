import { apiClient, HttpError } from '../core/api-client';
import type { SubjectProto } from './subjects.service';

export interface UserSubscriptionPayload {
    email: string;
    name: string;
    phone: string;
    subjects: string[];
}

export interface UserDTO {
    id: number;
    email: string;
    name: string;
    phone: string;
    subjects: SubjectProto[];
}

export const usersService = {
    getUser: async (email: string): Promise<UserDTO | null> => {
        try {
            return await apiClient.get<UserDTO>(`/users/${email}`);
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) {
                return null;
            }
            throw error;
        }
    },

    updateSubscription: async (payload: UserSubscriptionPayload): Promise<UserDTO> => {
        return apiClient.post<UserDTO>('/subscribe', payload);
    },

    deleteUser: async (email: string): Promise<void> => {
        return apiClient.delete<void>(`/users/${email}`);
    }
};
