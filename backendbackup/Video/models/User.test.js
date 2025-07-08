// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const User = require('./User');

// jest.mock('bcryptjs');

describe('User Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should define correct schema fields', () => {
        const schema = User.schema.obj;
        expect(schema.channelName).toBeDefined();
        expect(schema.email).toBeDefined();
        expect(schema.role).toBeDefined();
        expect(schema.password).toBeDefined();
        expect(schema.aboutText).toBeDefined();
        expect(schema.resetPasswordToken).toBeDefined();
        expect(schema.resetPasswordExpire).toBeDefined();
        expect(schema.avatarUrl).toBeDefined();
    });

    it('should validate email format', () => {
        const user = new User({
            channelName: 'testchannel',
            email: 'invalidemail',
            password: 'testpassword',
        });
        const validationError = user.validateSync();
        expect(validationError.errors.email.message).toEqual('Please add a valid email');
    });

    // it('should hash password before saving', async () => {
    //     const user = new User({
    //         channelName: 'testchannel',
    //         email: 'test@example.com',
    //         password: 'testpassword',
    //     });

    //     bcrypt.genSalt.mockResolvedValue('salt');
    //     bcrypt.hash.mockResolvedValue('hashedPassword');

    //     await user.save();

    //     expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    //     expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 'salt');
    //     expect(user.password).toEqual('hashedPassword');
    // });

    // it('should match password correctly', async () => {
    //     const user = new User({
    //         channelName: 'testchannel',
    //         email: 'test@example.com',
    //         password: 'testpassword',
    //     });

    //     bcrypt.compare.mockResolvedValue(true);

    //     const isMatch = await user.matchPassword('testpassword');

    //     expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedPassword');
    //     expect(isMatch).toBeTruthy();
    // });

    // it('should generate a valid JWT token', () => {
    //     const user = new User({
    //         _id: 'mockedUserId',
    //     });

    //     jwt.sign.mockReturnValue('mockedToken');

    //     const token = user.getSignedJwtToken();

    //     expect(jwt.sign).toHaveBeenCalledWith({ id: 'mockedUserId' }, process.env.JWT_SECRET, {
    //         expiresIn: process.env.JWT_EXPIRE,
    //     });
    //     expect(token).toBe('mockedToken');
    // });

    // it('should generate a valid reset password token', () => {
    //     const user = new User({
    //         _id: 'mockedUserId',
    //     });

    //     crypto.randomBytes.mockReturnValue({
    //         toString: () => 'mockedResetToken'
    //     });

    //     crypto.createHash.mockReturnValue({
    //         update: () => ({
    //             digest: () => 'hashedResetToken'
    //         })
    //     });

    //     const token = user.getResetPasswordToken();

    //     expect(crypto.randomBytes).toHaveBeenCalledWith(20);
    //     expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    //     expect(user.resetPasswordToken).toBe('hashedResetToken');
    //     expect(user.resetPasswordExpire).toBeDefined();
    //     expect(token).toBe('mockedResetToken');
    // });
});
