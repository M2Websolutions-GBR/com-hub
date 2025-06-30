const mongoose = require('mongoose');
const DBconnection = require('./db');

jest.mock('mongoose', () => ({
    createConnection: jest.fn(),
    connect: jest.fn(),
    set: jest.fn(),
}));

global.console = {
    log: jest.fn(),
};

describe('DB Connection', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to MongoDB successfully', async () => {
        const mockConnection = {
            connection: {
                host: 'localhost',
            },
        };

        mongoose.connect.mockResolvedValue(mockConnection);

        await DBconnection();

        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
        expect(global.console.log).toHaveBeenCalledWith(`MongoDB Connected: ${mockConnection.connection.host}`);
    });

    // FIXME: Check this please for connection error
    // it('should handle connection error', async () => {
    //     const mockError = new Error('Connection failed');

    //     mongoose.connect.mockRejectedValue(mockError);

    //     await DBconnection();

    //     expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);

    //     expect(global.console.log).toHaveBeenCalledWith('For some reasons we couldn\'t connect to the DB', mockError);

    //     expect(mockError).toBeInstanceOf(Error);
    //     expect(mockError.message).toEqual('Connection failed');
    // });



});
