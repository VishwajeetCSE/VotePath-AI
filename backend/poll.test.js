const request = require('supertest');
const app = require('./server');

describe('VotePath AI Poll API', () => {
  it('should retrieve poll standings', async () => {
    const res = await request(app).get('/api/polls/standings');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('parties');
  });

  it('should retrieve candidates', async () => {
    const res = await request(app).get('/api/polls/candidates');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should reject vote without reCAPTCHA token', async () => {
    const res = await request(app).post('/api/polls/vote').send({
      partyId: 'bjp'
    });
    expect(res.statusCode).toEqual(400); // Fails validation for missing token
    expect(res.body.success).toBe(false);
  });

  it('should reject vote without party selection', async () => {
    const res = await request(app).post('/api/polls/vote').send({
      token: 'fake-token'
    });
    expect(res.statusCode).toEqual(400); // Fails validation for missing partyId
  });

  it('should successfully record a valid vote and reject a duplicate vote from same IP', async () => {
    // First vote
    const res1 = await request(app).post('/api/polls/vote').send({
      partyId: 'bjp',
      token: 'fake-token'
    });
    expect(res1.statusCode).toEqual(200);
    expect(res1.body.success).toBe(true);

    // Second vote (should be rejected due to mock IP tracking in DB)
    const res2 = await request(app).post('/api/polls/vote').send({
      partyId: 'inc',
      token: 'fake-token'
    });
    expect(res2.statusCode).toEqual(429);
    expect(res2.body.success).toBe(false);
  });
});
