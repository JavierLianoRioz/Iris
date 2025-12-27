import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, HttpError } from './api-client';

describe('ApiClient', () => {
    let client: ApiClient;
    const testBaseUrl = '/test-api';

    beforeEach(() => {
        client = new ApiClient(testBaseUrl);
        global.fetch = vi.fn();
    });

    it('should execute GET request transmitting correct headers', async () => {
        const expectedData = { data: 'test' };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => expectedData,
        });

        const result = await client.get('/path');

        expect(global.fetch).toHaveBeenCalledWith(`${testBaseUrl}/path`, expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json',
            }),
        }));
        expect(result).toEqual(expectedData);
    });

    it('should throw HttpError with status and message when API returns structured error detail', async () => {
        const failureMessage = 'Custom failure reason';
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            json: async () => ({ detail: failureMessage }),
        });

        try {
            await client.get('/error');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect((error as HttpError).status).toBe(400);
            expect((error as HttpError).message).toBe(failureMessage);
        }
    });

    it('should throw HttpError with standard status text when API returns non-JSON error', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: async () => { throw new Error('Parse error') },
        });

        try {
            await client.get('/error');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect((error as HttpError).status).toBe(500);
            expect((error as HttpError).message).toContain('Internal Server Error');
        }
    });

    it('should return null when status is 204 No Content', async () => {
         (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 204,
        });

        const result = await client.get('/no-content');
        expect(result).toBeNull();
    });
});
