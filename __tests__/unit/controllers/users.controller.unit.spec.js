import { jest } from "@jest/globals";
import { UsersController } from "../../../src/controllers/users.controller.js";

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
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe("Users Controller Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("createUser Method", async () => {
        const req = mockRequest(
            { email: "test@test.com", password: "password", Checkpass: "password", name: "testName", emailstatus: "yes" },
            {},
            {}
        );
        const res = mockResponse();
        await usersController.createUser(req, res, mockNext);

        expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    });

    test("createUserToken Method", async () => {
        const req = mockRequest({ email: "test@test.com", token: "token" });
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
        const req = mockRequest({ email: "test@test.com", password: "password" });
        const res = mockResponse();

        const next = jest.fn();

        mockUsersService.getUserByEmail.mockResolvedValue({
            email: "test@test.com",
            password: "$2a$10$V9DPoPvZtRpg9t23wzl5cO3N0Y32F6XJ0tl5QG3Y1ZNvKCflCbx8u",
            emailstatus: "yes",
        });
        mockUsersService.signIn.mockResolvedValue({
            userJWT: "userJWT",
            refreshToken: "refreshToken",
        });
        await usersController.signIn(req, res, next);

        expect(mockUsersService.signIn).toHaveBeenCalledWith("test@test.com", "password");
        expect(mockUsersService.signIn).toHaveBeenCalledTimes(1);
        expect(res.cookie).toHaveBeenCalledWith("authorization", "Bearer userJWT");
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refreshToken");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "로그인 성공" });
    });

    test("updateUser Method", async () => {
        const mockReturn = { userId: 1 };
        mockUsersService.getUserById.mockReturnValue(mockReturn);
        mockUsersService.deleteUser.mockReturnValue(true);
        const userId = 1;
        const UserId = 2;
        const password = "password";
        const name = "testName";
        const permission = "Admin";
        const req = {
            params: { userId },
            body: { password, name },
            user: { UserId, permission },
        };
        const res = mockResponse();
        let next = jest.fn();

        await usersController.updateUser(req, res, next);

        expect(mockUsersService.updateUser).toHaveBeenCalledTimes(1);
        expect(mockUsersService.updateUser).toHaveBeenCalledWith(userId, password, name, permission);

        req.user.permission = "User";
        req.user.UserId = 2;
        mockUsersService.getUserById.mockReturnValue({ ...mockReturn, userId: 1 });
        next = (err) => {
            throw err;
        };
        await expect(usersController.updateUser(req, res, next)).rejects.toThrow("권한이 없습니다.");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "업데이트에 성공했습니다" });
    });

    test("deleteUser Method", async () => {
        const mockReturn = { userId: 1 };
        mockUsersService.getUserById.mockReturnValue(mockReturn);
        mockUsersService.deleteUser.mockReturnValue(true);
        const userId = 1;
        const UserId = 2;
        const permission = "Admin";
        const req = {
            params: { userId },
            user: { UserId, permission },
        };
        const res = mockResponse();
        let next = jest.fn();

        await usersController.deleteUser(req, res, next);

        expect(mockUsersService.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId, permission);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "삭제 성공" });
        req.user.permission = "User";
        req.user.UserId = 2;
        mockUsersService.getUserById.mockReturnValue({ ...mockReturn, userId: 1 });
        next = (err) => {
            throw err;
        };
        await expect(usersController.deleteUser(req, res, next)).rejects.toThrow("권한이 없습니다.");
    });
});
