import bcrypt from "bcrypt";
export class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    createUser = async (req, res, next) => {
        try {
            const { email, password, Checkpass, name, emailstatus } = req.body;

            const createdUser = await this.usersService.createUser(email, password, Checkpass, name, emailstatus);

            return res.status(201).json({ data: createdUser });
        } catch (err) {
            next(err);
        }
    };

    createUserToken = async (req, res, next) => {
        try {
            const { email, token } = req.body;
            await this.usersService.createUserToken(email, token);
            res.status(200).json({ message: "회원가입이 완료되었습니다." });
        } catch (err) {
            next(err);
        }
    };

    getUsers = async (req, res, next) => {
        try {
            const users = await this.usersService.getUsers();
            return res.status(200).json({ data: users });
        } catch (err) {
            next(err);
        }
    };

    getUserById = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const user = await this.usersService.getUserById(userId);
            return res.status(200).json({ data: user });
        } catch (err) {
            next(err);
        }
    };

    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await this.usersService.getUserByEmail(email);

            if (!email) return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
            else if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

            if (user.emailstatus !== "yes") return res.status(401).json({ message: "가입 대기중인 계정입니다." });

            const tokens = await this.usersService.signIn(email, password);
            res.cookie("authorization", `Bearer ${tokens.userJWT}`);
            res.cookie("refreshToken", tokens.refreshToken);
            return res.status(200).json({ message: "로그인 성공" });
        } catch (err) {
            next(err);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const { email, password, name } = req.body;

            const { userId } = req.user;

            if (!userId) {
                return res.status(403).json({ message: "본인의 정보만 변경할 수 있습니다." });
            }
            const updatedUser = await this.usersService.updateUser(userId, email, password, name);
            return res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const { userId } = req.user;
            if (!userId) {
                return res.status(403).json({ message: "본인의 아이디만 삭제할 수 있습니다." });
            }
            const deletedUser = await this.usersService.deleteUser(userId);
            res.status(200).json({ message: "삭제 성공" });
        } catch (err) {
            next(err);
        }
    };
}
