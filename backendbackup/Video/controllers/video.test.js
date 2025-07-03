const AWS = require('aws-sdk');
const {
    upload,
    uploadAvatar,
    stream,
    delete: deleteVideo,
    updateVideoDetails,
} = require('./videos');
const Video = require('../models/Video');
const User = require('../models/User');

jest.mock('aws-sdk');
jest.mock('../models/Video');
jest.mock('../models/User');

describe('Videos Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // TODO: Check for upload testing
    // describe('upload', () => {
    //     it('should upload a video', async () => {
    //         const req = {
    //             file: {
    //                 originalname: 'video.mp4',
    //             },
    //             body: {
    //                 title: 'Test Video',
    //                 description: 'This is a test video',
    //                 status: 'public',
    //             },
    //             user: { id: 'testUserId' },
    //         };
    //         const res = {
    //             status: jest.fn().mockReturnThis(),
    //             send: jest.fn(),
    //         };

    //         const mockKey = 'uploaded-video-key.mp4';
    //         const mockThumbnailUrl = `https://com-hub.s3.eu-central-1.amazonaws.com/thumbnails/uploaded-video-key-0.jpg`;
    //         const mockVideo = new Video({
    //             userId: 'testUserId',
    //             title: 'Test Video',
    //             description: 'This is a test video',
    //             status: 'public',
    //             key: mockKey,
    //             thumbnailUrl: mockThumbnailUrl,
    //         });

    //         Video.upload.mockResolvedValue(mockKey);
    //         Video.prototype.save.mockResolvedValue(mockVideo);

    //         await upload(req, res);

    //         expect(Video.upload).toHaveBeenCalledWith(req.file);
    //         expect(Video.prototype.save).toHaveBeenCalled();
    //         expect(res.status).toHaveBeenCalledWith(200);
    //         expect(res.send).toHaveBeenCalledWith(mockVideo);
    //     });
    // });

    describe('uploadAvatar', () => {
        it('should upload an avatar for the user', async () => {
            const req = {
                file: {
                    originalname: 'avatar.jpg',
                    buffer: Buffer.from('avatar-image-data'),
                    mimetype: 'image/jpeg',
                },
                user: { id: 'testUserId' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockData = {
                Location: 'https://com-hub.s3.eu-central-1.amazonaws.com/avatars/avatar.jpg',
            };
            const mockUser = { _id: 'testUserId', avatarUrl: mockData.Location };

            AWS.S3.mockImplementation(() => ({
                upload: jest.fn().mockReturnThis(),
                promise: jest.fn().mockResolvedValue(mockData),
            }));

            User.findByIdAndUpdate.mockResolvedValue(mockUser);

            await uploadAvatar(req, res);

            expect(AWS.S3).toHaveBeenCalledWith();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUser });
        });
    });

    describe('stream', () => {
        // it('should stream a video', async () => {
        //     const req = {
        //         params: { id: 'testVideoId' },
        //     };
        //     const res = {
        //         status: jest.fn().mockReturnThis(),
        //         json: jest.fn(),
        //     };

        //     const mockVideo = new Video({
        //         _id: 'testVideoId',
        //         key: 'test-video-key.mp4',
        //     });

        //     Video.findById.mockResolvedValue(mockVideo);

        //     const mockSignedUrl = 'https://com-hub.s3.eu-central-1.amazonaws.com/test-video-key.mp4';
        //     AWS.S3.prototype.getSignedUrl.mockImplementation((operation, params, callback) => {
        //         callback(null, mockSignedUrl);
        //     });

        //     await stream(req, res);

        //     expect(Video.findById).toHaveBeenCalledWith('testVideoId');
        //     expect(AWS.S3.prototype.getSignedUrl).toHaveBeenCalledWith('getObject', {
        //         Bucket: process.env.BUCKET_NAME,
        //         Key: 'test-video-key.mp4',
        //         Expires: 18000,
        //     });
        //     expect(res.json).toHaveBeenCalledWith({ video: mockVideo, url: mockSignedUrl });
        // });

        it('should handle error if video not found', async () => {
            const req = {
                params: { id: 'invalidVideoId' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            Video.findById.mockResolvedValue(null);

            await stream(req, res);

            expect(Video.findById).toHaveBeenCalledWith('invalidVideoId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Video not found.');
        });
    });

    describe('delete', () => {
        // it('should delete a video', async () => {
        //     const req = {
        //         params: { id: 'testVideoId' },
        //     };
        //     const res = {
        //         status: jest.fn().mockReturnThis(),
        //         json: jest.fn(),
        //     };

        //     const mockVideo = new Video({
        //         _id: 'testVideoId',
        //         key: 'test-video-key.mp4',
        //     });

        //     Video.findById.mockResolvedValue(mockVideo);
        //     AWS.S3.prototype.deleteObject.mockResolvedValue({
        //         promise: jest.fn().mockResolvedValue(),
        //     });

        //     await deleteVideo(req, res);

        //     expect(Video.findById).toHaveBeenCalledWith('testVideoId');
        //     expect(AWS.S3.prototype.deleteObject).toHaveBeenCalledWith({
        //         Bucket: process.env.BUCKET_NAME,
        //         Key: 'test-video-key.mp4',
        //     });
        //     expect(Video.findByIdAndDelete).toHaveBeenCalledWith('testVideoId');
        //     expect(res.status).toHaveBeenCalledWith(204);
        //     expect(res.json).toHaveBeenCalledWith({ success: true });
        // });

        it('should handle error if video not found', async () => {
            const req = {
                params: { id: 'invalidVideoId' },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            Video.findById.mockResolvedValue(null);

            await deleteVideo(req, res);

            expect(Video.findById).toHaveBeenCalledWith('invalidVideoId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Video not found' });
        });
    });

    describe('updateVideoDetails', () => {
        it('should update video details', async () => {
            const req = {
                body: {
                    videoId: 'testVideoId',
                    title: 'Updated Title',
                    description: 'Updated Description',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockVideo = new Video({
                _id: 'testVideoId',
                title: 'Original Title',
                description: 'Original Description',
            });

            Video.findById.mockResolvedValue(mockVideo);
            Video.prototype.save.mockResolvedValue();

            await updateVideoDetails(req, res);

            expect(Video.findById).toHaveBeenCalledWith('testVideoId');
            expect(mockVideo.title).toEqual('Updated Title');
            expect(mockVideo.description).toEqual('Updated Description');
            expect(Video.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                title: 'Updated Title',
                description: 'Updated Description',
            });
        });

        it('should handle error if video not found', async () => {
            const req = {
                body: {
                    videoId: 'invalidVideoId',
                    title: 'Updated Title',
                    description: 'Updated Description',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            Video.findById.mockResolvedValue(null);

            await updateVideoDetails(req, res);

            expect(Video.findById).toHaveBeenCalledWith('invalidVideoId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Video not found' });
        });
    });
});
