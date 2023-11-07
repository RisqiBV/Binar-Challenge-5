const request = require('supertest');
const app = require('./app');

describe('Integration Testing for User Endpoints', () => {
  let userId;

  describe('POST /api/v1/users', () => {
    it('should create a new user with a profile', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        profile: {
          identity_type: 'ID',
          identity_number: '1234567890',
          address: '123 Main St',
        }
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(user)
        .expect(201);

      userId = response.body.id;

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
      expect(response.body.profile).toMatchObject(user.profile);
    });

    it('should return an error if user data is incomplete', async () => {
      const incompleteUser = {
        name: 'Jane Doe',
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/users', () => {
    it('should retrieve a list of users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should retrieve user details by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
    });

    it('should return an error if user ID is not found', async () => {
      const nonExistentUserId = 9999;
      const response = await request(app)
        .get(`/api/v1/users/${nonExistentUserId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/users/:userId', () => {
    it('should update user details by ID', async () => {
      const updatedUserData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
      };

      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send(updatedUserData)
        .expect(200);

      expect(response.body.name).toBe(updatedUserData.name);
      expect(response.body.email).toBe(updatedUserData.email);
    });

    it('should return an error if user ID is not found', async () => {
      const nonExistentUserId = 9999;
      const updatedUserData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
      };

      const response = await request(app)
        .put(`/api/v1/users/${nonExistentUserId}`)
        .send(updatedUserData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    it('should delete a user by ID', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return an error if user ID is not found', async () => {
      const nonExistentUserId = 9999;
      const response = await request(app)
        .delete(`/api/v1/users/${nonExistentUserId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
