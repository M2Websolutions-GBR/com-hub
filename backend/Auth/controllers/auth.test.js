const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User');
const asyncHandler = require('@comhub/middleware/async');
const ErrorResponse = require('@comhub/middleware/errorResponse');

jest.mock('../models/User');
jest.mock('@comhub/middleware/errorResponse');
jest.mock('../utils/sendEmail', () => jest.fn());
jest.mock('google-auth-library', () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => ({ verifyIdToken: jest.fn() }))
    };
});
const sendEmail = require('../utils/sendEmail');
const { register, login, logout, forgotPassword, googleLogin } = require('./auth');

process.env.FRONTEND_URL = 'http://localhost:3000';

const app = express();
app.use(bodyParser.json());

app.post('/api/auth/register', asyncHandler(register));
app.post('/api/auth/login', asyncHandler(login));
app.get('/api/auth/logout', asyncHandler(logout));
app.post('/api/auth/forgotpassword', asyncHandler(forgotPassword));
app.post('/api/auth/googlelogin', asyncHandler(googleLogin));

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

    describe('POST /api/auth/forgotpassword', () => {
        it('should send a reset email when user exists', async () => {
            const mockUser = {
                email: 'test@example.com',
                getResetPasswordToken: jest.fn().mockReturnValue('token'),
                save: jest.fn()
            };
            User.findOne.mockResolvedValue(mockUser);
            sendEmail.mockResolvedValue();

            const response = await request(app)
                .post('/api/auth/forgotpassword')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: 'Email sent' });
            expect(mockUser.getResetPasswordToken).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(sendEmail).toHaveBeenCalledWith({
                to: 'test@example.com',
                subject: 'Password Reset',
                text: expect.stringContaining('http://localhost:3000/reset-password/token')
            });
        });
    });

    describe('POST /api/auth/googlelogin', () => {
        it('should login with a valid google token', async () => {
            const { OAuth2Client } = require('google-auth-library');
            const mockVerify = jest.fn().mockResolvedValue({
                getPayload: () => ({ email_verified: true, email: 'test@example.com', name: 'Test' })
            });
            OAuth2Client.mockImplementation(() => ({ verifyIdToken: mockVerify }));

            const mockUser = {
                getSignedJwtToken: jest.fn().mockReturnValue('jwt'),
            };
            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/auth/googlelogin')
                .send({ tokenId: 'google-token' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token', 'jwt');
        });
    });
});
