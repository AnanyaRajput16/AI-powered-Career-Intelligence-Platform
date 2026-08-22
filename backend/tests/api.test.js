const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the Express app

describe('API Endpoints Testing', () => {
  // Clean up database connection after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. GET /api/health returns HTTP 200 and status "active"
  it('GET /api/health should return 200 and active status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'active');
    expect(res.body).toHaveProperty('timestamp');
  });

  // 2. GET /api/jobs returns a successful response
  it('GET /api/jobs should return 200 and an array of jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // 3. An invalid API route returns JSON 404 instead of frontend HTML
  it('GET /api/invalid-route should return 404 JSON', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    expect(res.statusCode).toEqual(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('message', 'API Route Not Found');
  });

  // 4. Verify authentication protection for a protected endpoint
  it('GET /api/admin/users should return 401 Not authorized without token', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, no token provided');
  });
});
