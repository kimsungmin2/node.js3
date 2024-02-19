import { jest } from "@jest/globals";
import { UsersService } from "../../../src/services/users.service.js";
import bcrypt from "bcrypt";

let mockUsersRepository = {
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    createUser: jest.fn(),
    updateUserEmailStatus: jest.fn(),
    getUsers: jest.fn(),
};

let usersService = new UsersService(mockUsersRepository);

describe("Users Service Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("hashPassword Method", async () => {
        const password = "testPassword";
        const hashedPassword = await usersService.hashPassword(password);

        expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
    });

    test("createUser Method", async () => {
        const mockReturn = "createUser Return String";
        const email = "test@email.com";
        const password = "testPassword";
        const Checkpass = "testPassword";
        const name = "testName";
        mockUsersRepository.createUser.mockReturnValue(mockReturn);
        const user = await usersService.createUser(email, password, Checkpass, name);

        expect(user).toBe(mockReturn);
        expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    });

    test("createUserToken Method", async () => {
        const mockReturn = {
            userId: 1,
            emailstatus: "nono",
            verificationToken: "testToken",
        };
        const email = "test@email.com";
        const token = "testToken";
        mockUsersRepository.getUserByEmail.mockReturnValue(mockReturn);
        await usersService.createUserToken(email, token);

        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);
        expect(mockUsersRepository.updateUserEmailStatus).toHaveBeenCalledTimes(1);
    });

    test("getUsers Method", async () => {
        const mockReturn = ["user1", "user2"];
        mockUsersRepository.getUsers.mockReturnValue(mockReturn);
        const users = await usersService.getUsers();

        expect(users).toBe(mockReturn);
        expect(mockUsersRepository.getUsers).toHaveBeenCalledTimes(1);
    });

    test("getUserById Method", async () => {
        const mockReturn = "getUserById Return String";
        const userId = 1;
        mockUsersRepository.getUserById.mockReturnValue(mockReturn);
        const user = await usersService.getUserById(userId);

        expect(user).toBe(mockReturn);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(userId);
    });
    test("getUserByEmail Method", async () => {
        const mockReturn = "getUserByEmail Return String";
        const email = "test@email.com";
        mockUsersRepository.getUserByEmail.mockReturnValue(mockReturn);
        const user = await usersService.getUserByEmail(email);

        expect(user).toBe(mockReturn);
        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);
    });

    test("signIn Method", async () => {
        const mockReturn = {
            userId: 1,
            password: await bcrypt.hash("testPassword", 10),
        };
        const email = "test@email.com";
        const password = "testPassword";
        mockUsersRepository.getUserByEmail.mockReturnValue(mockReturn);
        const tokens = await usersService.signIn(email, password);

        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);
        expect(tokens).toHaveProperty("userJWT");
        expect(tokens).toHaveProperty("refreshToken");
    });

    test("updateUser Method", async () => {
        const mockReturn = "updateUser Return String";
        const userId = 1;
        const email = "test@email.com";
        const password = "testPassword";
        const name = "testName";
        mockUsersRepository.getUserById.mockReturnValue({ userId });
        mockUsersRepository.updateUser.mockReturnValue(mockReturn);
        const updatedUser = await usersService.updateUser(userId, email, password, name);

        expect(updatedUser).toBe(mockReturn);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(mockUsersRepository.updateUser).toHaveBeenCalledTimes(1);
    });

    test("deleteUser Method", async () => {
        const mockReturn = { message: "삭제 성공" };
        const userId = 1;
        mockUsersRepository.getUserById.mockReturnValue({ userId });
        const deletedUser = await usersService.deleteUser(userId);

        expect(deletedUser).toEqual(mockReturn);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(mockUsersRepository.deleteUser).toHaveBeenCalledTimes(1);
    });
});
