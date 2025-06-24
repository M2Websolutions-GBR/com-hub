const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { register, login, logout } = require('./auth');
const User = require('../models/User');
const asyncHandler = require('@comhub/middleware/async');
const ErrorResponse = require('@comhub/middleware/errorResponse');

jest.mock('../models/User');
jest.mock('@comhub/middleware/errorResponse');

const app = express();
app.use(bodyParser.json());

app.post('/api/auth/register', asyncHandler(register));
app.post('/api/auth/login', asyncHandler(login));
app.get('/api/auth/logout', asyncHandler(logout));

describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const mockUser = {
                _id: 'someid',
                channelName: 'testchannel',
                email: 'test@example.com',
                password: 'hashedpassword',
                getSignedJwtToken: jest.fn().mockReturnValue('fake-jwt-token')
            };

            User.create.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    channelName: 'testchannel',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token', 'fake-jwt-token');
            expect(User.create).toHaveBeenCalledWith({
                channelName: 'testchannel',
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });

    // describe('POST /api/auth/login', () => {
    //   it('should login a user and return a token', async () => {
    //     const mockUser = {
    //       _id: 'someid',
    //       email: 'test@example.com',
    //       password: 'hashedpassword',
    //       matchPassword: jest.fn().mockResolvedValue(true),
    //       getSignedJwtToken: jest.fn().mockReturnValue('fake-jwt-token')
    //     };

    //     User.findOne.mockResolvedValue(mockUser);

    //     const response = await request(app)
    //       .post('/api/auth/login')
    //       .send({
    //         email: 'test@example.com',
    //         password: 'password123'
    //       });

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('success', true);
    //     expect(response.body).toHaveProperty('token', 'fake-jwt-token');
    //     expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    //   });

    //   it('should return an error if email or password is missing', async () => {
    //     const response = await request(app)
    //       .post('/api/auth/login')
    //       .send({
    //         email: '',
    //         password: ''
    //       });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty('success', false);
    //     expect(response.body).toHaveProperty('error', 'Please provide an email and password');
    //   });

    //   it('should return an error if credentials are invalid', async () => {
    //     User.findOne.mockResolvedValue(null);

    //     const response = await request(app)
    //       .post('/api/auth/login')
    //       .send({
    //         email: 'test@example.com',
    //         password: 'password123'
    //       });

    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty('success', false);
    //     expect(response.body).toHaveProperty('error', 'Invalid credentials');
    //   });
    // });

    describe('GET /api/auth/logout', () => {
        it('should logout the user and clear the cookie', async () => {
            const response = await request(app).get('/api/auth/logout');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toEqual({});
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toContain('token=none');
        });
    });
});
