// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';

describe('OAuth Endpoints', () => {
  it('should obtain a token with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/token')
      .send({
        grant_type: 'password',
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });

  it('should fail to obtain a token with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/token')
      .send({
        grant_type: 'password',
        username: 'testuser',
        password: 'wrongpassword',
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Add more tests for authorization, token validation, etc.
});
