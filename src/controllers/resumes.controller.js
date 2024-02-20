export class ResumeController {
    constructor(resumesService) {
        this.resumesService = resumesService;
    }

    createResume = async (req, res, next) => {
        const { userId } = req.user;
        const { title, content, status = "APPLY" } = req.body;

        const createdResume = await this.resumesService.createResume(userId, title, content, status);
        return res.status(201).json({ message: "게시글 생성에 성공하였습니다" });
    };

    getResumes = async (req, res, next) => {
        const { orderKey, orderValue } = req.query;
        const resumes = await this.resumesService.getResumes(orderKey, orderValue);
        return res.status(200).json({ data: resumes });
    };
    getResumeById = async (req, res, next) => {
        const { resumeId } = req.params;
        const resume = await this.resumesService.getResumeById(resumeId);

        return res.status(200).json({ data: resume });
    };

    updateResume = async (req, res, next) => {
        try {
            const { resumeId } = req.params;
            const { title, content, status } = req.body;
            const { userId, permission } = req.user;
            const resume = await this.resumesService.getResumeById(resumeId);

            if (permission !== "Admin" && resume.userId !== userId) {
                throw new Error("권한이 없습니다.");
            }

            const updatedResume = await this.resumesService.updateResume(resumeId, title, content, status, userId, permission);
            return res.status(200).json(updatedResume);
        } catch (err) {
            next(err);
        }
    };

    deleteResume = async (req, res, next) => {
        try {
            const { userId, permission } = req.user;
            const { resumeId } = req.params;

            const resume = await this.resumesService.getResumeById(resumeId);

            if (permission !== "Admin" && resume.userId !== userId) {
                throw new Error("권한이 없습니다.");
            }

            const deletedResume = await this.resumesService.deleteResume(resumeId, userId, permission);
            res.status(200).json({ message: "삭제 성공" });
        } catch (err) {
            next(err);
        }
    };
}
