const mongoose = require('mongoose');
const {
    getComments,
    getCommentByVideoId,
    createComment,
    updateComment,
    deleteComment
} = require('../controllers/comments');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const Category = require('../models/Category');
const asyncHandler = require('@comhub/middleware/async');
const ErrorResponse = require('@comhub/middleware/errorResponse');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (params, body, user) => {
    return { params, body, user };
};

jest.mock('../models/Comment');
jest.mock('../models/Video');
jest.mock('../models/Category');

describe('Comment Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getComments', () => {
        it('should return comments from advancedResults', async () => {
            const res = mockResponse();
            const mockAdvancedResults = { success: true, count: 2, data: [{ text: 'Comment 1' }, { text: 'Comment 2' }] };

            res.advancedResults = mockAdvancedResults;

            await getComments({}, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAdvancedResults);
        });
    });

    // describe('getCommentByVideoId', () => {
    // it('should return comments for a video', async () => {
    //     const req = mockRequest({ videoId: 'mockVideoId' });
    //     const res = mockResponse();
    //     const next = jest.fn();
    //     const mockComments = [{ text: 'Comment 1' }, { text: 'Comment 2' }];

    //     Comment.find.mockResolvedValueOnce(mockComments);

    //     await getCommentByVideoId(req, res, next);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({ success: true, data: mockComments });
    // });

    //     it('should return ErrorResponse if no comments found for video', async () => {
    //         const req = mockRequest({ videoId: 'invalidVideoId' });
    //         const res = mockResponse();
    //         const next = jest.fn();

    //         Comment.find.mockResolvedValueOnce(null);

    //         await getCommentByVideoId(req, res, next);

    //         expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    //         expect(next.mock.calls[0][0].message).toBe(`No comment with that video id of ${req.params.videoId}`);
    //     });
    // });

    describe('createComment', () => {
        // it('should create a new comment', async () => {
        //     const req = mockRequest({}, { videoId: 'mockVideoId', text: 'New Comment', categories: ['cat1', 'cat2'] }, { user: { id: 'mockUserId' } });
        //     const res = mockResponse();
        //     const next = jest.fn();
        //     const mockVideo = { _id: 'mockVideoId', status: 'public' };
        //     const mockCategories = [{ _id: 'cat1', name: 'Category 1' }, { _id: 'cat2', name: 'Category 2' }];
        //     const mockComment = { _id: 'mockCommentId', videoId: 'mockVideoId', text: 'New Comment', userId: 'mockUserId', categories: mockCategories };

        //     Video.findById.mockResolvedValueOnce(mockVideo);
        //     Category.find.mockResolvedValueOnce(mockCategories);
        //     Comment.create.mockResolvedValueOnce(mockComment);

        //     await createComment(req, res, next);

        //     expect(res.status).toHaveBeenCalledWith(200);
        //     expect(res.json).toHaveBeenCalledWith({ success: true, data: mockComment });
        // });

        it('should return ErrorResponse if video not found', async () => {
            const req = mockRequest({}, { videoId: 'invalidVideoId', text: 'New Comment', categories: ['cat1', 'cat2'] }, { user: { id: 'mockUserId' } });
            const res = mockResponse();
            const next = jest.fn();

            Video.findById.mockResolvedValueOnce(null);

            await createComment(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
            expect(next.mock.calls[0][0].message).toBe(`No video with id of ${req.body.videoId}`);
        });
    });

    // describe('updateComment', () => {
    //     it('should update an existing comment', async () => {
    //         const req = mockRequest({ params: { id: 'mockCommentId' }, body: { text: 'Updated Comment', categories: ['cat1'] }, user: { id: 'mockUserId' } });
    //         const res = mockResponse();
    //         const next = jest.fn();
    //         const mockComment = { _id: 'mockCommentId', userId: 'mockUserId', videoId: { userId: 'mockUserId' }, categories: [{ _id: 'cat1', name: 'Category 1' }] };
    //         const updatedMockComment = { ...mockComment, text: 'Updated Comment', categories: [{ _id: 'cat1', name: 'Category 1' }] };

    //         Comment.findById.mockResolvedValueOnce(mockComment);
    //         Category.find.mockResolvedValueOnce([{ _id: 'cat1', name: 'Category 1' }]);
    //         Comment.findByIdAndUpdate.mockResolvedValueOnce(updatedMockComment);

    //         await updateComment(req, res, next);

    //         expect(res.status).toHaveBeenCalledWith(200);
    //         expect(res.json).toHaveBeenCalledWith({ success: true, data: updatedMockComment });
    //     });

    //     it('should return ErrorResponse if comment not found', async () => {
    //         const req = mockRequest({ params: { id: 'invalidCommentId' }, body: { text: 'Updated Comment', categories: ['cat1'] }, user: { id: 'mockUserId' } });
    //         const res = mockResponse();
    //         const next = jest.fn();

    //         Comment.findById.mockResolvedValueOnce(null);

    //         await updateComment(req, res, next);

    //         expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    //         expect(next.mock.calls[0][0].message).toBe(`No comment with id of ${req.params.id}`);
    //     });

    //     it('should return ErrorResponse if user is not authorized to update comment', async () => {
    //         const req = mockRequest({ params: { id: 'mockCommentId' }, body: { text: 'Updated Comment', categories: ['cat1'] }, user: { id: 'differentUserId' } });
    //         const res = mockResponse();
    //         const next = jest.fn();
    //         const mockComment = { _id: 'mockCommentId', userId: 'mockUserId', videoId: { userId: 'mockUserId' }, categories: [{ _id: 'cat1', name: 'Category 1' }] };

    //         Comment.findById.mockResolvedValueOnce(mockComment);

    //         await updateComment(req, res, next);

    //         expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    //         expect(next.mock.calls[0][0].message).toBe(`You are not authorized to update this comment`);
    //     });
    // });

    // describe('deleteComment', () => {
    //     it('should delete an existing comment', async () => {
    //         const req = mockRequest({ params: { id: 'mockCommentId' }, user: { id: 'mockUserId' } });
    //         const res = mockResponse();
    //         const next = jest.fn();
    //         const mockComment = { _id: 'mockCommentId', userId: 'mockUserId', videoId: { userId: 'mockUserId' }, categories: [{ _id: 'cat1', name: 'Category 1' }] };

    //         Comment.findById.mockResolvedValueOnce(mockComment);
    //         Comment.findByIdAndDelete.mockResolvedValueOnce(mockComment);

    //         await deleteComment(req, res, next);

    //         expect(res.status).toHaveBeenCalledWith(200);
    //         expect(res.json).toHaveBeenCalledWith({ success: true, comment: mockComment });
    //     });

    //     it('should return ErrorResponse if comment not found', async () => {
    //         const req = mockRequest({ params: { id: 'invalidCommentId' }, user: { id: 'mockUserId' } });
    //         const res = mockResponse();
    //         const next = jest.fn();

    //         Comment.findById.mockResolvedValueOnce(null);

    //         await deleteComment(req, res, next);

    //         expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    //         expect(next.mock.calls[0][0].message).toBe(`No comment with id of ${req.params.id}`);
    //     });

    //     it('should return ErrorResponse if user is not authorized to delete comment', async () => {
    //         const req = mockRequest({ params: { id: 'mockCommentId' }, user: { id: 'differentUserId' } });
    //         const res = mockResponse();
    //         const next = jest.fn();
    //         const mockComment = { _id: 'mockCommentId', userId: 'mockUserId', videoId: { userId: 'mockUserId' }, categories: [{ _id: 'cat1', name: 'Category 1' }] };

    //         Comment.findById.mockResolvedValueOnce(mockComment);

    //         await deleteComment(req, res, next);

    //         expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    //         expect(next.mock.calls[0][0].message).toBe(`You are not authorized to delete this comment`);
    //     });
    // });
});

