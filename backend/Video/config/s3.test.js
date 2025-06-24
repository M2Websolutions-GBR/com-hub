// s3.test.js
const AWS = require('aws-sdk');
const createS3Instance = require('./s3');
require('dotenv').config(); // Load environment variables from .env

jest.mock('aws-sdk', () => {
    const mockS3 = {
        config: {
            update: jest.fn()
        },
        S3: jest.fn(() => ({ /* mock S3 instance */ }))
    };
    return mockS3;
});

describe('AWS S3 Configuration', () => {
    let s3Instance;

    beforeAll(() => {
        s3Instance = createS3Instance();
    });

    it('should configure AWS SDK with environment variables', () => {
        expect(AWS.config.update).toHaveBeenCalledWith({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    });

    // it('should return an instance of AWS.S3', () => {
    //     expect(s3Instance).toBeInstanceOf(AWS.S3);
    // });
});
