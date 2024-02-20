import { expect, jest } from "@jest/globals";
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

        await expect(usersService.createUser(email, "asd", Checkpass, name)).rejects.toThrow("비밀번호가 6자 이상이어야 됩니다.");

        await expect(usersService.createUser(email, password, "Checkpass", name)).rejects.toThrow("비밀번호 확인과 일치해야 합니다.");

        mockUsersRepository.getUserByEmail.mockReturnValue({});
        await expect(usersService.createUser(email, password, Checkpass, name)).rejects.toThrow("이미 존재하는 이메일입니다.");
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
        mockUsersRepository.getUserByEmail.mockReturnValue(null);
        await expect(usersService.createUserToken(email, token)).rejects.toThrow("유저를 찾을 수 없습니다.");

        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);
        expect(mockUsersRepository.updateUserEmailStatus).toHaveBeenCalledTimes(1);

        mockUsersRepository.getUserByEmail.mockResolvedValue({ emailstatus: "yes" });
        await expect(usersService.createUserToken(email, token)).rejects.toThrow("이미 이메일 인증이 완료된 유저입니다.");

        mockUsersRepository.getUserByEmail.mockResolvedValue({ emailstatus: "nono", verificationToken: "nop" });
        await expect(usersService.createUserToken(email, token)).rejects.toThrow("인증 코드가 일치하지 않습니다.");
    });

    test("getUsers Method", async () => {
        const mockReturn = ["user1", "user2"];
        mockUsersRepository.getUsers.mockReturnValue(mockReturn);
        const users = await usersService.getUsers();

        expect(users).toBe(mockReturn);
        expect(mockUsersRepository.getUsers).toHaveBeenCalledTimes(1);
    });

    test("getUserById Method", async () => {
        const mockReturn = "userId";
        const userId = 1;

        mockUsersRepository.getUserById.mockReturnValue(Promise.resolve(mockReturn));

        const user = await usersService.getUserById(userId);

        expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(userId);

        expect(user).toBe(mockReturn);

        mockUsersRepository.getUserById.mockReturnValue(Promise.resolve(null));
        await expect(usersService.getUserById(999)).rejects.toThrow("존재하지 않는 아이디입니다.");
    });

    test("getUserByEmail Method", async () => {
        const mockReturn = "email";
        const email = "test@email.com";

        mockUsersRepository.getUserByEmail.mockReturnValue(Promise.resolve(mockReturn));

        const user = await usersService.getUserByEmail(email);

        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);

        expect(user).toBe(mockReturn);

        mockUsersRepository.getUserByEmail.mockReturnValue(Promise.resolve(null));
        await expect(usersService.getUserByEmail("wrong@email.com")).rejects.toThrow("존재하지 않는 이메일입니다.");
    });

    test("signIn Method", async () => {
        const mockReturn = {
            userId: 1,
            email: "test@email.com",
            password: "testPassword",
            emailstatus: "yes",
        };
        const email = "test@email.com";
        const password = "testPassword";

        bcrypt.compare = jest.fn(() => Promise.resolve(true));

        mockUsersRepository.getUserByEmail.mockReturnValue(Promise.resolve(mockReturn));

        mockUsersRepository.getUserByEmail.mockReturnValue(Promise.resolve(null));
        await expect(usersService.signIn("wrong@email.com", password)).rejects.toThrow("존재하지 않는 이메일입니다.");

        bcrypt.compare = jest.fn(() => Promise.resolve(false));
        mockUsersRepository.getUserByEmail.mockReturnValue(Promise.resolve(mockReturn));
        await expect(usersService.signIn(email, "wrongPassword")).rejects.toThrow("비밀번호가 일치하지 않습니다.");
    });

    test("updateUser Method", async () => {
        const mockUser = {
            userId: 1,
            password: "testPassword",
            email: "test@email.com",
            name: "testName",
            permission: "testPermission",
        };
        const userId = 1;
        const newPassword = "testPassword";
        const newName = "testName";
        const newPermission = "testPermission";
        const hashedPassword = "hashedNewPassword";

        mockUsersRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));
        usersService.hashPassword = jest.fn(() => Promise.resolve(hashedPassword));
        mockUsersRepository.updateUser.mockReturnValue(
            Promise.resolve({ ...mockUser, password: hashedPassword, name: newName, permission: newPermission })
        );

        const updatedUser = await usersService.updateUser(userId, newPassword, newName, newPermission);

        expect(mockUsersRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.getUserById).toHaveBeenCalledWith(userId);
        expect(usersService.hashPassword).toHaveBeenCalledTimes(1);
        expect(usersService.hashPassword).toHaveBeenCalledWith(newPassword);
        expect(mockUsersRepository.updateUser).toHaveBeenCalledTimes(1);
        expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(userId, hashedPassword, newName, newPermission);

        expect(updatedUser.password).toBe(hashedPassword);
        expect(updatedUser.name).toBe(newName);
        expect(updatedUser.permission).toBe(newPermission);

        mockUsersRepository.getUserById.mockReturnValue(Promise.resolve(null));
        await expect(usersService.updateUser("userId", newPassword, newName, newPermission)).rejects.toThrow("해당 사용자를 찾을 수 없습니다.");
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
        mockUsersRepository.getUserById.mockReturnValue(Promise.resolve(null));
        await expect(usersService.deleteUser("userId")).rejects.toThrow("해당 사용자를 찾을 수 없습니다.");
    });
});
