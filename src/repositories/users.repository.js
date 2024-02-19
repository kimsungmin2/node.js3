export class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    createUser = async (email, hashedPassword, Checkpass, name, emailstatus, token) => {
        const user = await this.prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                Checkpass,
                name,
                emailstatus,
                verificationToken: token.toString(),
            },
        });
        return user;
    };

    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({
            where: { email },
        });

        return user;
    };

    updateUserEmailStatus = async (userId, emailstatus) => {
        await this.prisma.users.update({
            where: { userId },
            data: { emailstatus },
        });
    };

    getUsers = async () => {
        const users = await this.prisma.users.findMany();
        return users;
    };

    getUserById = async (userId) => {
        const user = await this.prisma.users.findFirst({
            where: { userId: +userId },
        });
        return user;
    };

    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({ where: { email } });
        return user;
    };

    updateUser = async (userId, email, hashedPassword, name) => {
        const updatedUser = await this.prisma.users.update({
            where: { userId: +userId },
            data: { email, password: hashedPassword, name },
        });

        return updatedUser;
    };

    deleteUser = async (userId) => {
        const deletedUser = await this.prisma.users.delete({
            where: {
                userId: +userId,
            },
        });
        return deletedUser;
    };
}
