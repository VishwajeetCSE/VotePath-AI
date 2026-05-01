const request = require('supertest');
const app = require('./server');
const { getChatResponse } = require('./services/aiService');

jest.mock('./services/aiService');

describe('VotePath AI Backend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return health check message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe('VotePath AI Backend is running successfully!');
    });
  });

  describe('POST /chat', () => {
    it('should validate input and return 400 if message is empty', async () => {
      const res = await request(app).post('/chat').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should successfully get a reply from the mocked AI service', async () => {
      getChatResponse.mockResolvedValue('Hello, I am mocked VotePath AI!');

      const res = await request(app).post('/chat').send({
        message: 'Hello'
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('reply', 'Hello, I am mocked VotePath AI!');
      expect(getChatResponse).toHaveBeenCalledTimes(1);
    });

    it('should return cached response for identical queries', async () => {
      getChatResponse.mockResolvedValue('Mocked Response');

      // First request (miss)
      const res1 = await request(app).post('/chat').send({ message: 'Cache Test' });
      expect(res1.statusCode).toEqual(200);
      expect(getChatResponse).toHaveBeenCalledTimes(1);

      // Second request (hit)
      const res2 = await request(app).post('/chat').send({ message: 'Cache Test' });
      expect(res2.statusCode).toEqual(200);
      expect(getChatResponse).toHaveBeenCalledTimes(1); // Should still be 1!
    });
  });
});
