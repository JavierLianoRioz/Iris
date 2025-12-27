import type { SubjectProto } from '../services/client/subjects.service';

export interface User {
    id?: number;
    name: string;
    email: string;
    picture?: string;
    phone?: string;
    subjects: SubjectProto[];
}
