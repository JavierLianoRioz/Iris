import { apiClient } from '../core/api-client';

export interface SubjectProto {
    code: string;
    name: string;
}

export const getSubjects = async (): Promise<SubjectProto[]> => {
    return apiClient.get<SubjectProto[]>('/subjects');
};
