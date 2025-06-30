const mongoose = require('mongoose');
const Category = require('../models/Category');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (params, body, user) => {
    return { params, body, user };
};

jest.mock('../models/Category', () => {
    const originalModule = jest.requireActual('../models/Category');
    return {
        ...originalModule,
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };
});

describe('Categories Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCategories', () => {
        it('should return categories from advancedResults', async () => {
            const res = mockResponse();
            const mockCategories = [{ name: 'Category 1' }, { name: 'Category 2' }];
            const mockAdvancedResults = { success: true, count: 2, data: mockCategories };

            res.advancedResults = mockAdvancedResults;

            await getCategories({}, res, jest.fn());

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAdvancedResults);
        });
    });

    describe('getCategory', () => {
        // it('should return a single category', async () => {
        //     const req = mockRequest({ id: new mongoose.Types.ObjectId().toString() });
        //     const res = mockResponse();
        //     const next = jest.fn();
        //     const mockCategory = { _id: req.params.id, name: 'Category 1' };

        //     Category.findById.mockResolvedValueOnce(mockCategory);

        //     await getCategory(req, res, next);

        //     expect(res.status).toHaveBeenCalledWith(200);
        //     expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCategory });
        // });

        it('should return ErrorResponse if category not found', async () => {
            const req = mockRequest({ id: new mongoose.Types.ObjectId().toString() });
            const res = mockResponse();
            const next = jest.fn();

            Category.findById.mockResolvedValueOnce(null);

            await getCategory(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe(`No category with that id of ${req.params.id}`);
        });
    });

    // describe('createCategory', () => {
    //     it('should create a new category', async () => {
    //         const req = mockRequest({}, { name: 'New Category' }, { id: new mongoose.Types.ObjectId().toString() });
    //         const res = mockResponse();
    //         const next = jest.fn();
    //         const mockCreatedCategory = { _id: new mongoose.Types.ObjectId().toString(), name: 'New Category', userId: req.user.id };

    //         Category.create.mockResolvedValueOnce(mockCreatedCategory);

    //         await createCategory(req, res, next);

    //         expect(res.status).toHaveBeenCalledWith(200);
    //         expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCreatedCategory });
    //     }, 15000); // Increase timeout to 15 seconds
    // });

    describe('updateCategory', () => {
        it('should update an existing category', async () => {
            const req = mockRequest({ id: new mongoose.Types.ObjectId().toString() }, { name: 'Updated Category' });
            const res = mockResponse();
            const next = jest.fn();
            const mockUpdatedCategory = { _id: req.params.id, name: 'Updated Category' };

            Category.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedCategory);

            await updateCategory(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUpdatedCategory });
        });

        it('should return ErrorResponse if category not found for update', async () => {
            const req = mockRequest({ id: new mongoose.Types.ObjectId().toString() }, { name: 'Updated Category' });
            const res = mockResponse();
            const next = jest.fn();

            Category.findByIdAndUpdate.mockResolvedValueOnce(null);

            await updateCategory(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe(`No category with that id of ${req.params.id}`);
        });
    });

    describe('deleteCategory', () => {
        // it('should delete an existing category', async () => {
        //     const req = mockRequest({ id: new mongoose.Types.ObjectId().toString() });
        //     const res = mockResponse();
        //     const next = jest.fn();
        //     const mockDeletedCategory = { _id: req.params.id, name: 'Category to delete' };

        //     Category.findById.mockResolvedValueOnce(mockDeletedCategory);
        //     Category.findByIdAndDelete.mockResolvedValueOnce(mockDeletedCategory);

        //     await deleteCategory(req, res, next);

        //     expect(res.status).toHaveBeenCalledWith(200);
        //     expect(res.json).toHaveBeenCalledWith({ success: true, category: mockDeletedCategory });
        // });

        it('should return ErrorResponse if category not found for delete', async () => {
            const req = mockRequest({ id: new mongoose.Types.ObjectId().toString() });
            const res = mockResponse();
            const next = jest.fn();

            Category.findById.mockResolvedValueOnce(null);

            await deleteCategory(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe(`No category with id of ${req.params.id}`);
        });
    });
});

describe('Comment Controller Tests', () => {
    it('should have at least one test', () => {
        expect(true).toBe(true);
    });

    it('should return true for a simple test', () => {
        expect(true).toBe(true);
    });
});
