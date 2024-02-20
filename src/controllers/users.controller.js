export class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    createUser = async (req, res, next) => {
        try {
            const { email, password, Checkpass, name, emailstatus } = req.body;

            const createdUser = await this.usersService.createUser(email, password, Checkpass, name, emailstatus);

            return res.status(201).json({ message: "이메일을 전송했습니다." });
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
            const { userId } = req.params;
            const { password, name, permission } = req.body;

            const { UserId } = req.user;

            if (permission !== "Admin" && userId !== UserId) {
                throw new Error("권한이 없습니다.");
            }
            const updatedUser = await this.usersService.updateUser(userId, password, name, permission);
            return res.status(200).json({ message: "업데이트에 성공했습니다" });
        } catch (err) {
            next(err);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { UserId, permission } = req.user;

            if (permission !== "Admin" && userId !== UserId) {
                throw new Error("권한이 없습니다.");
            }

            const deletedUser = await this.usersService.deleteUser(userId, permission);
            res.status(200).json({ message: "삭제 성공" });
        } catch (err) {
            next(err);
        }
    };
}
