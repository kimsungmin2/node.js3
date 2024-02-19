import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const { email_service, user, pass } = process.env;

const transporter = nodemailer.createTransport({
    service: email_service,
    auth: {
        user: user,
        pass: pass,
    },
});
export class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }

    hashPassword = async (password) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };

    sendVerificationEmail = (email, token) => {
        return new Promise((resolve, reject) => {
            const verificationLink = `http://localhost:3020/email?token=${token}`;

            const mailOptions = {
                from: user,
                to: email,
                subject: "이메일 인증",
                text: `아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요: ${token}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    };

    createUser = async (email, password, Checkpass, name) => {
        const emailstatus = "nono";
        const hashedPassword = await this.hashPassword(password);

        let token;
        if (emailstatus === "nono") {
            token = Math.floor(Math.random() * 900000) + 100000;
            await this.sendVerificationEmail(email, token.toString());
        }

        const user = await this.usersRepository.createUser(email, hashedPassword, Checkpass, name, emailstatus, token);

        return user;
    };

    createUserToken = async (email, token) => {
        const user = await this.usersRepository.getUserByEmail(email);

        if (!user) {
            throw new Error("유저를 찾을 수 없습니다.");
        }

        if (user.emailstatus !== "nono") {
            throw new Error("이미 이메일 인증이 완료된 유저입니다.");
        }

        if (user.verificationToken !== token) {
            throw new Error("인증 코드가 일치하지 않습니다.");
        }

        await this.usersRepository.updateUserEmailStatus(user.userId, "yes");
    };

    getUsers = async () => {
        const users = await this.usersRepository.getUsers();
        return users;
    };

    getUserById = async (userId) => {
        const user = await this.usersRepository.getUserById(userId);
        return user;
    };

    getUserByEmail = async (email) => {
        const user = await this.usersRepository.getUserByEmail(email);
        if (!user) throw new Error("존재하지 않는 이메일입니다.");
        return user;
    };

    signIn = async (email, password) => {
        const user = await this.usersRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("존재하지 않는 이메일입니다.");
        }

        const checkpass = await bcrypt.compare(password, user.password);
        if (!checkpass) {
            throw new Error("비밀번호가 일치하지 않습니다.");
        }

        const userJWT = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return { userJWT, refreshToken };
    };

    updateUser = async (userId, email, password, name) => {
        const user = await this.usersRepository.getUserById(userId);
        const hashedPassword = await this.hashPassword(password);

        if (!user) {
            throw new Error("해당 사용자를 찾을 수 없습니다.");
        }

        const updatedUser = await this.usersRepository.updateUser(userId, email, hashedPassword, name);
        return updatedUser;
    };

    deleteUser = async (userId) => {
        const user = await this.usersRepository.getUserById(userId);

        if (!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        await this.usersRepository.deleteUser(userId);
        return { message: "삭제 성공" };
    };
}
