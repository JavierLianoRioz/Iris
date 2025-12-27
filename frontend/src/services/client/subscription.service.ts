import { apiClient } from '../core/api-client';
import type { UserDTO, UserSubscriptionPayload } from './users.service';

export const subscriptionService = {
    subscribe: async (payload: UserSubscriptionPayload): Promise<UserDTO> => {
        return apiClient.post<UserDTO>('/subscribe', payload);
    }
};
