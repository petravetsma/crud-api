import { server, startServer } from '../src/server';
import supertest from 'supertest';
import { Server } from 'http';

describe('User API', () => {
    const endpoint = '/api/users';
    const request = supertest(server);

    let userId: string;
    let serverInstance: Server;

    beforeAll(() => {
        serverInstance = startServer(0);
    });

    afterAll(() => {
        serverInstance.close();
    });

    it('GET /api/users should return empty array', async () => {
        const res = await request.get(endpoint);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST /api/users should create a new user', async () => {
        const data = { username: 'Nastya', age: 25, hobbies: ['reading'] };
        const res = await request.post(endpoint).send(data);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(data));
        expect(res.body).toHaveProperty('id');
        userId = res.body.id;
    });

    it('GET /api/users/:id should return created user', async () => {
        const res = await request.get(`${endpoint}/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(userId);
    });

    it('PUT /api/users/:id should update user', async () => {
        const data = { username: 'Nastya New', age: 26, hobbies: ['writing'] };
        const res = await request.put(`${endpoint}/${userId}`).send(data);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(data));
    });

    it('DELETE /api/users/:id should delete user', async () => {
        const res = await request.delete(`${endpoint}/${userId}`);

        expect(res.status).toBe(204);
    });

    it('GET /api/users/:id should return 404 after deletion', async () => {
        const res = await request.get(`${endpoint}/${userId}`);

        expect(res.status).toBe(404);
    });
});
