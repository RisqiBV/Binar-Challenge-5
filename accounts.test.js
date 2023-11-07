const request = require('supertest');
const app = require('./app');

describe('Integration Testing for Bank Account Endpoints', () => {
    let accountId;
    let existingUserId;
  
    beforeAll(async () => {

    });
  
    describe('POST /api/v1/accounts', () => {
      it('should create a new bank account for an existing user', async () => {
        const accountData = {
          user_id: existingUserId,
          bank_name: 'Bank XYZ',
          bank_account_number: '1234567890',
          balance: 1000,
        };
  
        const response = await request(app)
          .post('/api/v1/accounts')
          .send(accountData)
          .expect(201);
  
        accountId = response.body.id;
  
        expect(response.body).toHaveProperty('id');
        expect(response.body.bank_name).toBe(accountData.bank_name);
        expect(response.body.bank_account_number).toBe(accountData.bank_account_number);
        expect(response.body.balance).toBe(accountData.balance);
      });
  
      it('should return an error if the user ID does not exist', async () => {
        const nonExistentUserId = 9999;
        const accountData = {
          user_id: nonExistentUserId,
          bank_name: 'Bank XYZ',
          bank_account_number: '1234567890',
          balance: 1000,
        };
  
        const response = await request(app)
          .post('/api/v1/accounts')
          .send(accountData)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    describe('GET /api/v1/accounts', () => {
      it('should retrieve a list of bank accounts', async () => {
        const response = await request(app)
          .get('/api/v1/accounts')
          .expect(200);
  
        expect(Array.isArray(response.body)).toBe(true);

      });
    });
  
    describe('GET /api/v1/accounts/:accountId', () => {
      it('should retrieve bank account details by ID', async () => {
        const response = await request(app)
          .get(`/api/v1/accounts/${accountId}`)
          .expect(200);
  
        expect(response.body.id).toBe(accountId);

      });
  
      it('should return an error if bank account ID is not found', async () => {
        const nonExistentAccountId = 9999;
        const response = await request(app)
          .get(`/api/v1/accounts/${nonExistentAccountId}`)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    describe('PUT /api/v1/accounts/:accountId', () => {
      it('should update bank account details by ID', async () => {
        const updatedAccountData = {
          bank_name: 'Updated Bank Name',
          bank_account_number: '9876543210',
          balance: 2000,
        };
  
        const response = await request(app)
          .put(`/api/v1/accounts/${accountId}`)
          .send(updatedAccountData)
          .expect(200);
  
        expect(response.body.bank_name).toBe(updatedAccountData.bank_name);
        expect(response.body.bank_account_number).toBe(updatedAccountData.bank_account_number);
        expect(response.body.balance).toBe(updatedAccountData.balance);

      });
  
      it('should return an error if bank account ID is not found', async () => {
        const nonExistentAccountId = 9999;
        const updatedAccountData = {
          bank_name: 'Updated Bank Name',
          bank_account_number: '9876543210',
          balance: 2000,
        };
  
        const response = await request(app)
          .put(`/api/v1/accounts/${nonExistentAccountId}`)
          .send(updatedAccountData)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    describe('DELETE /api/v1/accounts/:accountId', () => {
      it('should delete a bank account by ID', async () => {
        const response = await request(app)
          .delete(`/api/v1/accounts/${accountId}`)
          .expect(200);
  
        expect(response.body).toHaveProperty('message');
      });
  
      it('should return an error if bank account ID is not found', async () => {
        const nonExistentAccountId = 9999;
        const response = await request(app)
          .delete(`/api/v1/accounts/${nonExistentAccountId}`)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    afterAll(async () => {

    });
});
