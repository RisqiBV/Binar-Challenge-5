const request = require('supertest');
const app = require('./app');

describe('Integration Testing for User Profile Endpoints', () => {
    let profileId;

    beforeAll(async () => {
    });
  
    describe('POST /api/v1/profile', () => {
      it('should create a new user profile', async () => {
        const profileData = {
          user_id: userId,
          identity_type: 'KTP',
          identity_number: '1234567890',
          address: 'Jl. Contoh No. 123',
        };
  
        const response = await request(app)
          .post('/api/v1/profile')
          .send(profileData)
          .expect(201);
  
        profileId = response.body.id;
  
        expect(response.body).toHaveProperty('id');
        expect(response.body.user_id).toBe(profileData.user_id);
        expect(response.body.identity_type).toBe(profileData.identity_type);
        expect(response.body.identity_number).toBe(profileData.identity_number);
        expect(response.body.address).toBe(profileData.address);
      });
  
      it('should return an error if user ID is not found', async () => {
        const invalidProfileData = {
          user_id: nonExistentUserId,
          identity_type: 'KTP',
          identity_number: '1234567890',
          address: 'Jl. Contoh No. 123',
        };
  
        const response = await request(app)
          .post('/api/v1/profile')
          .send(invalidProfileData)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    describe('GET /api/v1/profile', () => {
      it('should retrieve a list of user profiles', async () => {
        const response = await request(app)
          .get('/api/v1/profile')
          .expect(200);
  
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  
    describe('GET /api/v1/profile/:profileId', () => {
      it('should retrieve profile details by ID', async () => {
        const response = await request(app)
          .get(`/api/v1/profile/${profileId}`)
          .expect(200);
  
        expect(response.body.id).toBe(profileId);
      });
  
      it('should return an error if profile ID is not found', async () => {
        const nonExistentProfileId = 9999;
        const response = await request(app)
          .get(`/api/v1/profile/${nonExistentProfileId}`)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    describe('PUT /api/v1/profile/:profileId', () => {
      it('should update a user profile by ID', async () => {
        const updatedProfileData = {
          identity_type: 'SIM',
          identity_number: '9876543210',
          address: 'Jl. Baru No. 456',
        };
  
        const response = await request(app)
          .put(`/api/v1/profile/${profileId}`)
          .send(updatedProfileData)
          .expect(200);
  
        expect(response.body.id).toBe(profileId);
        expect(response.body.identity_type).toBe(updatedProfileData.identity_type);
        expect(response.body.identity_number).toBe(updatedProfileData.identity_number);
        expect(response.body.address).toBe(updatedProfileData.address);
      });
  
      it('should return an error if profile ID is not found', async () => {
        const nonExistentProfileId = 9999;
        const updatedProfileData = {
          identity_type: 'SIM',
          identity_number: '9876543210',
          address: 'Jl. Baru No. 456',
        };
  
        const response = await request(app)
          .put(`/api/v1/profile/${nonExistentProfileId}`)
          .send(updatedProfileData)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    describe('DELETE /api/v1/profile/:profileId', () => {
      it('should delete a user profile by ID', async () => {
        const response = await request(app)
          .delete(`/api/v1/profile/${profileId}`)
          .expect(200);
  
        expect(response.body).toHaveProperty('message');
      });
  
      it('should return an error if profile ID is not found', async () => {
        const nonExistentProfileId = 9999;
        const response = await request(app)
          .delete(`/api/v1/profile/${nonExistentProfileId}`)
          .expect(404);
  
        expect(response.body).toHaveProperty('error');
      });
    });
  
    afterAll(async () => {
    });
});
