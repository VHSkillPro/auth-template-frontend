import { IApiResponse } from "@/types";

/**
 * Handles the response from a fetch request, parsing the JSON body.
 *
 * If the response is not OK (i.e., status is not in the range 200-299),
 * it returns the parsed JSON as an `IApiResponse`.
 * Otherwise, it returns the parsed JSON as type `T`.
 *
 * @template T - The expected type of the successful response body.
 * @param response - The fetch API Response object to handle.
 * @returns A promise resolving to either type `T` (on success) or `IApiResponse` (on error).
 */
async function handleResponse<T>(
    response: Response
): Promise<T | IApiResponse> {
    if (!response.ok) {
        return (await response.json()) as Promise<IApiResponse>;
    }
    return response.json() as Promise<T>;
}

/**
 * Makes an HTTP request to the specified API endpoint and returns the parsed response.
 *
 * @template T - The expected response data type.
 * @param endpoint - The API endpoint to call, appended to the base backend URL.
 * @param options - Optional fetch configuration options.
 * @returns A promise resolving to the parsed response of type `T` or `IApiResponse`.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const url = `${baseUrl}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        return handleResponse<T | IApiResponse>(response);
    } catch {
        return {
            success: false,
            statusCode: 500,
            message: "An error occurred while fetching the API.",
        } as IApiResponse;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),
    put: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
