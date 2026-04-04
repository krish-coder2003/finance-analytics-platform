const request = require('supertest');
const app = require('../app');

describe('Sanity Tests', () => {
  it('Should successfully connect to root API health-check', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('Should handle unknown routes globally via 404', async () => {
    const response = await request(app).get('/api/fake_route_never_exists');
    expect(response.status).toBe(404);
  });
});
