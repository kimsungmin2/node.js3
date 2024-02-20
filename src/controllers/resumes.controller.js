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
                throw new Error("이력서 상태가 이상합니다.");
            }

            const createdResume = await this.resumesService.createResume(userId, title, content, status);
            return res.status(201).json({ message: "게시글 생성에 성공하였습니다" });
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
            if (!resume) {
                throw new Error("해당 이력서를 찾을 수 없습니다.");
            }
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
            const resume = await this.resumesService.getResumeById(resumeId);
            if (!resume) {
                throw new Error("해당 이력서를 찾을 수 없습니다.");
            }
            if (permission !== "Admin" && resume.userId !== userId) {
                throw new Error("권한이 없습니다.");
            }
            const statuses = ["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"];

            if (!statuses.includes(status)) {
                throw new Error("이력서 상태가 이상합니다.");
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
            if (!resume) {
                throw new Error("해당 이력서를 찾을 수 없습니다.");
            }
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
