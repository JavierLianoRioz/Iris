export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'HttpError';
    }
}

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = import.meta.env.PUBLIC_API_BASE_URL || '/api') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            let failureReason = `Error fetching ${path}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.detail) {
                    failureReason = errorData.detail;
                } else if (errorData.error) {
                    failureReason = errorData.error;
                }
            } catch (ignored) {
            }
            throw new HttpError(response.status, failureReason);
        }

        if (response.status === 204) {
            return null as T;
        }

        return response.json();
    }

    public get<T>(path: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, { method: 'GET', headers });
    }

    public post<T>(path: string, body: any, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        });
    }

    public put<T>(path: string, body: any, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        });
    }

    public delete<T>(path: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>(path, { method: 'DELETE', headers });
    }
}

export const apiClient = new ApiClient();
