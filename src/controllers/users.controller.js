export class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }

    createUser = async (req, res, next) => {
        const { email, password, Checkpass, name, emailstatus } = req.body;

        const createdUser = await this.usersService.createUser(email, password, Checkpass, name, emailstatus);

        return res.status(201).json({ message: "이메일을 전송했습니다." });
    };

    createUserToken = async (req, res, next) => {
        const { email, token } = req.body;
        await this.usersService.createUserToken(email, token);
        res.status(200).json({ message: "회원가입이 완료되었습니다." });
    };

    getUsers = async (req, res, next) => {
        const users = await this.usersService.getUsers();
        return res.status(200).json({ data: users });
    };

    getUserById = async (req, res, next) => {
        const { userId } = req.params;
        const user = await this.usersService.getUserById(userId);
        return res.status(200).json({ data: user });
    };

    signIn = async (req, res, next) => {
        const { email, password } = req.body;

        const tokens = await this.usersService.signIn(email, password);
        res.cookie("authorization", `Bearer ${tokens.userJWT}`);
        res.cookie("refreshToken", tokens.refreshToken);
        return res.status(200).json({ message: "로그인 성공" });
    };

    updateUser = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { password, name } = req.body;

            const { UserId, permission } = req.user;

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
