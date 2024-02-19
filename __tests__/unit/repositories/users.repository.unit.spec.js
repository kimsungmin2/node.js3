// __tests__/unit/users.repository.unit.spec.js

import { jest, expect } from "@jest/globals";
import { UsersRepository } from "../../../src/repositories/users.repository.js";

// Prisma 클라이언트에서는 아래 6개의 메서드만 사용합니다.
let mockPrisma = {
    users: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    },
};

let usersRepository = new UsersRepository(mockPrisma);

describe("Users Repository Unit Test", () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test("createUser Method", async () => {
        const mockReturn = "create User Return String";
        mockPrisma.users.create.mockReturnValue(mockReturn);
        const createUserParams = {
            email: "createUserEmail",
            hashedPassword: "createUserHashedPassword",
            Checkpass: "createUserCheckpass",
            name: "createUserName",
            emailstatus: "createUserEmailstatus",
            token: "createUserToken",
        };
        const createdUserData = await usersRepository.createUser(
            createUserParams.email,
            createUserParams.hashedPassword,
            createUserParams.Checkpass,
            createUserParams.name,
            createUserParams.emailstatus,
            createUserParams.token
        );
        expect(createdUserData).toEqual(mockReturn);

        expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);

        expect(mockPrisma.users.create).toHaveBeenCalledWith({
            data: {
                email: createUserParams.email,
                password: createUserParams.hashedPassword,
                Checkpass: createUserParams.Checkpass,
                name: createUserParams.name,
                emailstatus: createUserParams.emailstatus,
                verificationToken: createUserParams.token.toString(),
            },
        });
    });

    test("getUserByEmail Method", async () => {
        const mockReturn = "getUserByEmail Return String";
        mockPrisma.users.findFirst.mockReturnValue(mockReturn);
        const userEmail = "test@test.com";
        const userData = await usersRepository.getUserByEmail(userEmail);

        expect(userData).toBe(mockReturn);
        expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { email: userEmail } });
    });

    test("updateUserEmailStatus Method", async () => {
        const mockReturn = "updateUserEmailStatus Return String";
        mockPrisma.users.update.mockReturnValue(mockReturn);
        const userId = 1;
        const emailStatus = "verified";
        await usersRepository.updateUserEmailStatus(userId, emailStatus);

        expect(mockPrisma.users.update).toHaveBeenCalledTimes(1);
        expect(mockPrisma.users.update).toHaveBeenCalledWith({ where: { userId }, data: { emailstatus: emailStatus } });
    });
    test("getUsers Method", async () => {
        const mockReturn = ["user1", "user2"];
        mockPrisma.users.findMany.mockReturnValue(mockReturn);
        const users = await usersRepository.getUsers();

        expect(users).toBe(mockReturn);
        expect(mockPrisma.users.findMany).toHaveBeenCalledTimes(1);
    });

    // getUserById 메서드 테스트
    test("getUserById Method", async () => {
        const mockReturn = "getUserById Return String";
        mockPrisma.users.findFirst.mockReturnValue(mockReturn);
        const userId = 1;
        const user = await usersRepository.getUserById(userId);

        expect(user).toBe(mockReturn);
        expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { userId: +userId } });
    });

    // getUserByEmail 메서드 테스트
    test("getUserByEmail Method", async () => {
        const mockReturn = "getUserByEmail Return String";
        mockPrisma.users.findFirst.mockReturnValue(mockReturn);
        const email = "test@test.com";
        const user = await usersRepository.getUserByEmail(email);

        expect(user).toBe(mockReturn);
        expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { email } });
    });

    // updateUser 메서드 테스트
    test("updateUser Method", async () => {
        const mockReturn = "updateUser Return String";
        mockPrisma.users.update.mockReturnValue(mockReturn);
        const userId = 1;
        const email = "update@test.com";
        const hashedPassword = "hashedPassword";
        const name = "updatedName";
        const updatedUser = await usersRepository.updateUser(userId, email, hashedPassword, name);

        expect(updatedUser).toBe(mockReturn);
        expect(mockPrisma.users.update).toHaveBeenCalledTimes(1);
        expect(mockPrisma.users.update).toHaveBeenCalledWith({
            where: { userId: +userId },
            data: { email, password: hashedPassword, name },
        });
    });
    test("deleteUser Method", async () => {
        const mockReturn = "deleteUser Return String";
        mockPrisma.users.delete.mockReturnValue(mockReturn);
        const userId = 1;
        const deletedUser = await usersRepository.deleteUser(userId);

        expect(deletedUser).toBe(mockReturn);
        expect(mockPrisma.users.delete).toHaveBeenCalledTimes(1);
        expect(mockPrisma.users.delete).toHaveBeenCalledWith({ where: { userId } });
    });
});