const { MongoMemoryServer } = require('mongodb-memory-server');
const dal = require('../dal'); // Adjust the path as necessary

let db, stopDB;

beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const dbName = mongod.instanceInfo.dbName;
    // Configure DAL to use the in-memory database
    const setup = await dal.setupDAL(uri, dbName);
    db = setup.db;
    stopDB = setup.stopDB;
});

afterAll(async () => {
    await stopDB();
});

beforeEach(async () => {
    await db.collection('users').deleteMany({});
});

test('create and findOne user', async () => {
    await dal.create('John Doe', 'john@example.com', 'password123');
    const user = await dal.findOne('john@example.com');
    expect(user).toBeDefined();
    expect(user.name).toBe('John Doe');
});

test('find users', async () => {
    await dal.create('Jane Doe', 'jane@example.com', 'password123');
    const users = await dal.find('jane@example.com');
    expect(users.length).toBe(1);
    expect(users[0].name).toBe('Jane Doe');
});

test('update user', async () => {
    await dal.create('John Doe', 'john@example.com', 'password123');
    await dal.update('john@example.com', { name: 'Johnny Doe' });
    const user = await dal.findOne('john@example.com');
    expect(user.name).toBe('Johnny Doe');
});

test('deposit to user account', async () => {
    await dal.create('John Doe', 'john@example.com', 'password123');
    await dal.deposit('john@example.com', 100);
    const user = await dal.findOne('john@example.com');
    expect(user.balance).toBe(100);
});

test('withdraw from user account', async () => {
    await dal.create('John Doe', 'john@example.com', 'password123');
    await dal.deposit('john@example.com', 100);
    await dal.withdraw('john@example.com', 50);
    const user = await dal.findOne('john@example.com');
    expect(user.balance).toBe(50);
});

test('retrieve all users', async () => {
    await dal.create('John Doe', 'john@example.com', 'password123');
    await dal.create('Jane Doe', 'jane@example.com', 'password123');
    const users = await dal.all();
    expect(users.length).toBeGreaterThan(1);
});

//errorMiddleware tests

const { errorHandler, ValidationError, NotFoundError } = require('../middlewares/errorMiddleware');

describe('error handling middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    test('should handle ValidationError correctly', () => {
        const validationError = new ValidationError('Validation error message');
        errorHandler(validationError, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Validation error message' });
        expect(mockNext).not.toHaveBeenCalled();
    });

      test('should handle NotFoundError correctly', () => {
        const notFoundError = new NotFoundError('Not found error message');
        errorHandler(notFoundError, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not found error message' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle other errors with status 500 by default', () => {
        const otherError = new Error('Some other error');
        errorHandler(otherError, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next middleware if headersSent is true', () => {
        mockResponse.headersSent = true; // Set headersSent to true
        const error = new Error('Some error');
        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });

});