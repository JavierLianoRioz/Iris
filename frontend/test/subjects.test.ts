import { describe, it, expect, vi } from 'vitest';
import { GET } from '../src/pages/api/subjects/index';

describe('Subject Endpoints', () => {
    it('GET /api/subjects returns list', async () => {
        const mockRequest = new Request('http://localhost:4321/api/subjects', { method: 'GET' });
        const mockContext = { request: mockRequest, params: {}, redirect: vi.fn() } as any;

        const response = await GET(mockContext);
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    it('POST /api/subjects is NOT allowed (Read-Only)', async () => {
        // Dynamically import to check exports without build error
        const subjectModule = await import('../src/pages/api/subjects/index');
        expect(subjectModule).not.toHaveProperty('POST');
    });
});
