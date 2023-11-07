const request = require('supertest');
const app = require('./app');

describe('Integration Testing for Bank Transaction Endpoints', () => {
  let transactionId;

  beforeAll(async () => {
  });

  describe('POST /api/v1/transactions', () => {
    it('should create a new bank transaction', async () => {
      const transactionData = {
        source_account_id: sourceAccountId,
        destination_account_id: destinationAccountId,
        amount: 100,
      };

      const response = await request(app)
        .post('/api/v1/transactions')
        .send(transactionData)
        .expect(201);

      transactionId = response.body.id;

      expect(response.body).toHaveProperty('id');
      expect(response.body.source_account_id).toBe(transactionData.source_account_id);
      expect(response.body.destination_account_id).toBe(transactionData.destination_account_id);
      expect(response.body.amount).toBe(transactionData.amount);
    });

    it('should return an error if source or destination account is not found', async () => {
      const invalidTransactionData = {
        source_account_id: nonExistentSourceAccountId,
        destination_account_id: destinationAccountId,
        amount: 100,
      };

      const response = await request(app)
        .post('/api/v1/transactions')
        .send(invalidTransactionData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return an error if source account balance is insufficient', async () => {
      const insufficientBalanceTransactionData = {
        source_account_id: sourceAccountId,
        destination_account_id: destinationAccountId,
        amount: 1000000,
      };

      const response = await request(app)
        .post('/api/v1/transactions')
        .send(insufficientBalanceTransactionData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/transactions', () => {
    it('should retrieve a list of transactions', async () => {
      const response = await request(app)
        .get('/api/v1/transactions')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/v1/transactions/:transactionId', () => {
    it('should retrieve transaction details by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .expect(200);

      expect(response.body.id).toBe(transactionId);
    });

    it('should return an error if transaction ID is not found', async () => {
      const nonExistentTransactionId = 9999;
      const response = await request(app)
        .get(`/api/v1/transactions/${nonExistentTransactionId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/transactions/:transactionId', () => {
    it('should delete a bank transaction by ID', async () => {
      const response = await request(app)
        .delete(`/api/v1/transactions/${transactionId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return an error if transaction ID is not found', async () => {
      const nonExistentTransactionId = 9999;
      const response = await request(app)
        .delete(`/api/v1/transactions/${nonExistentTransactionId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  afterAll(async () => {
  });
});
