import type { APIRoute } from 'astro';
import { getAllSubjects } from '../../../services/backend/subjects.repository';
import { assert } from '../../../utils/assert';

export const GET: APIRoute = async () => {
    const subjects = await getAllSubjects();

    return new Response(JSON.stringify(subjects), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
};


