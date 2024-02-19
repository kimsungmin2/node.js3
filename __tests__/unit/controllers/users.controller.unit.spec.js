import { jest } from "@jest/globals";
import { UsersController } from "../../../src/controllers/users.controller.js";
import bcrypt from "bcrypt";

let mockUsersService = {
    createUser: jest.fn(),
    createUserToken: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    signIn: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
};

let usersController = new UsersController(mockUsersService);

const mockRequest = (body, params, user) => ({
    body,
    params,
    user,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe("Users Controller Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("createUser Method", async () => {
        const req = mockRequest({ email: "test@test.com", password: "password", Checkpass: "password", name: "Test", emailstatus: "yes" }, {}, {});
        const res = mockResponse();
        await usersController.createUser(req, res, mockNext);

        expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    });

    test("createUserToken Method", async () => {
        const req = mockRequest({ email: "test@test.com", token: "token" }, {}, {});
        const res = mockResponse();
        await usersController.createUserToken(req, res, mockNext);

        expect(mockUsersService.createUserToken).toHaveBeenCalledTimes(1);
    });

    test("getUsers Method", async () => {
        const req = mockRequest({}, {}, {});
        const res = mockResponse();
        await usersController.getUsers(req, res, mockNext);

        expect(mockUsersService.getUsers).toHaveBeenCalledTimes(1);
    });

    test("getUserById Method", async () => {
        const req = mockRequest({}, { userId: 1 }, {});
        const res = mockResponse();
        await usersController.getUserById(req, res, mockNext);

        expect(mockUsersService.getUserById).toHaveBeenCalledTimes(1);
    });

    test("signIn Method", async () => {
        const req = mockRequest({ email: "test@test.com", password: "password" }, {}, {});
        const res = mockResponse();

        mockUsersService.getUserByEmail.mockResolvedValue({
            email: "test@test.com",
            password: "$2a$10$V9DPoPvZtRpg9t23wzl5cO3N0Y32F6XJ0tl5QG3Y1ZNvKCflCbx8u", // bcrypt hash of 'password'
            emailstatus: "yes",
        });
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        await usersController.signIn(req, res, mockNext);

        expect(mockUsersService.getUserByEmail).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(mockUsersService.signIn).toHaveBeenCalledTimes(1);
    });

    test("updateUser Method", async () => {
        const req = mockRequest({ email: "test@test.com", password: "password", name: "Test" }, {}, { userId: 1 });
        const res = mockResponse();
        await usersController.updateUser(req, res, mockNext);

        expect(mockUsersService.updateUser).toHaveBeenCalledTimes(1);
    });

    test("deleteUser Method", async () => {
        const req = mockRequest({}, {}, { userId: 1 });
        const res = mockResponse();
        await usersController.deleteUser(req, res, mockNext);

        expect(mockUsersService.deleteUser).toHaveBeenCalledTimes(1);
    });
});
