export class ResumeController {
    constructor(resumesService) {
        this.resumesService = resumesService;
    }

    createResume = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { title, content, status = "APPLY" } = req.body;

            const Statuses = ["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"];

            if (!Statuses.includes(status)) {
                return res.status(409).json({
                    message: "이력서 상태가 이상합니다.",
                });
            }

            const createdResume = await this.resumesService.createResume(userId, title, content, status);
            return res.status(201).json({ data: createdResume });
        } catch (err) {
            next(err);
        }
    };

    getResumes = async (req, res, next) => {
        try {
            const resumes = await this.resumesService.getResumes();
            return res.status(200).json({ data: resumes });
        } catch (err) {
            next(err);
        }
    };

    getResumeById = async (req, res, next) => {
        try {
            const { resumeId } = req.params;
            const resume = await this.resumesService.getResumeById(resumeId);
            return res.status(200).json({ data: resume });
        } catch (err) {
            next(err);
        }
    };

    updateResume = async (req, res, next) => {
        try {
            const { resumeId } = req.params;
            const { title, content, status } = req.body;
            const { userId, permission } = req.user;

            const updatedResume = await this.resumesService.updateResume(resumeId, title, content, status, userId, permission);
            return res.status(200).json(updatedResume);
        } catch (err) {
            next(err);
        }
    };

    deleteResume = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { resumeId } = req.params;

            const deletedResume = await this.resumesService.deleteResume(resumeId, userId);
            res.status(200).json({ message: "삭제 성공" });
        } catch (err) {
            next(err);
        }
    };
}
