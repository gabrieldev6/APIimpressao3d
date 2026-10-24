import {describe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../src/app';



describe('GET /health', () => {
    it('deve retornar status 200', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        // expect(response.body).toBe({ status: 'ok' });
    });
});
