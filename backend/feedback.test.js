const request = require('supertest');
const app = require('./server');

describe('VotePath AI Feedback API', () => {
  it('should successfully submit feedback with valid input', async () => {
    const res = await request(app).post('/api/feedback').send({
      rating: 5,
      comment: 'Great app!'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('feedbackId');
  });

  it('should reject feedback with invalid rating', async () => {
    const res = await request(app).post('/api/feedback').send({
      rating: 6,
      comment: 'This should fail'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject feedback with empty comment', async () => {
    const res = await request(app).post('/api/feedback').send({
      rating: 4,
      comment: '   '
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should retrieve feedback data', async () => {
    const res = await request(app).get('/api/feedback');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('averageRating');
  });
});
