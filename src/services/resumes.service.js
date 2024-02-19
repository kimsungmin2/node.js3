export class ResumesService {
    constructor(resumesRepository) {
        this.resumesRepository = resumesRepository;
    }

    createResume = async (userId, title, content) => {
        const status = "APPLY";
        const resume = await this.resumesRepository.createResume(userId, title, content, status);
        return resume;
    };

    getResumes = async (orderKey, orderValue) => {
        const resumes = await this.resumesRepository.getResumes(orderKey, orderValue);
        return resumes.map((resume) => {
            return {
                resumeId: resume.resumeId,
                userId: resume.userId,
                title: resume.title,
                status: resume.status,
                name: resume.user.name,
                createdAt: resume.createdAt,
                updatedAt: resume.updatedAt,
            };
        });
    };

    getResumeById = async (resumeId) => {
        const resume = await this.resumesRepository.getResumeById(resumeId);
        return resume;
    };

    updateResume = async (resumeId, title, content, status, userId, permission) => {
        const resume = await this.resumesRepository.getResumeById(resumeId);

        if (!resume) {
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }

        // 권한이 Admin이 아니고, 작성한 유저가 아니라면 오류를 던집니다.
        if (permission !== "Admin" && resume.userId !== userId) {
            throw new Error("권한이 없습니다.");
        }

        const statuses = ["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"];

        if (!statuses.includes(status)) {
            throw new Error("이력서 상태가 이상합니다.");
        }

        const updatedResume = await this.resumesRepository.updateResume(resumeId, title, content, status);
        return updatedResume;
    };

    deleteResume = async (resumeId, userId, permission) => {
        const resume = await this.resumesRepository.getResumeById(resumeId);

        if (!resume) {
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }

        // 권한이 Admin이 아니고, 작성한 유저가 아니라면 오류를 던집니다.
        if (permission !== "Admin" && resume.userId !== userId) {
            throw new Error("권한이 없습니다.");
        }

        if (!resume) {
            throw new Error("이력서를 찾을 수 없습니다.");
        }

        await this.resumesRepository.deleteResume(resumeId, userId);
        return { message: "삭제 성공" };
    };
}
