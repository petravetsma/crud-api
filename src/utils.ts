import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import { User } from './User';

export const isValidUserData = (body: unknown): body is Omit<User, 'id'> => {
    return (
        typeof body === 'object' &&
        body !== null &&
        'username' in body &&
        'age' in body &&
        'hobbies' in body &&
        typeof body.username === 'string' &&
        typeof body.age === 'number' &&
        Array.isArray(body.hobbies)
    );
};

export const setResp = <T>(
    res: ServerResponse,
    result: ResponseSuccess<T> | ResponseError,
) => {
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    if (result.status !== 204) {
        res.end(JSON.stringify(result.body));
    } else {
        res.end();
    }
};

export const getUserId = (url: string): string | null | undefined => {
    const parts = url.split('/').filter(Boolean);
    const hasId = parts.length === 3;
    return hasId ? parts[2] : null;
};

export const responseErrors: Errors = {
    BAD_ID: () => ({ status: 400, body: { message: 'Invalid ID format' } }),
    ENF: () => ({ status: 404, body: { message: 'Endpoint not found' } }),
    NF: () => ({ status: 404, body: { message: 'User not found' } }),
    MRF: () => ({ status: 400, body: { message: 'Missing required fields' } }),
    MNA: () => ({ status: 405, body: { message: 'Method not allowed' } }),
    ISE: () => ({ status: 500, body: { message: 'Internal Server Error' } }),
};

export const responseSuccess: Success = {
    OK: <T>(data: T) => ({ status: 200, body: data }),
    CREATE: <T>(data: T) => ({ status: 201, body: data }),
    DELETE: () => ({ status: 204 }),
};

export type Errors = {
    BAD_ID: () => ResponseError;
    ENF: () => ResponseError;
    NF: () => ResponseError;
    MRF: () => ResponseError;
    MNA: () => ResponseError;
    ISE: () => ResponseError;
};

export type Success = {
    OK: <T>(data: T) => ResponseSuccess<T>;
    CREATE: <T>(data: T) => ResponseSuccess<T>;
    DELETE: () => ResponseSuccess<undefined>;
};

export const getRequestBody = (req: IncomingMessage): Promise<unknown> =>
    new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => {
            try {
                resolve(JSON.parse(data));
            } catch {
                reject();
            }
        });
    });

interface ResponseResult<T> {
    status: number;
    body?: T;
}

export type ResponseSuccess<T> = ResponseResult<T>;

export type ResponseError = ResponseResult<{ message: string }>;
