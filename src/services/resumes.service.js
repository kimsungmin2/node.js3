import { sendTodayData } from "../middlewares/slack.middlewares.js";

export class ResumesService {
    constructor(resumesRepository) {
        this.resumesRepository = resumesRepository;
    }

    createResume = async (userId, title, content) => {
        const status = "APPLY";
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const resume = await this.resumesRepository.createResume(userId, title, content, status);
        const Statuses = ["APPLY", "DROP", "PASS", "INTERVIEW1", "INTERVIEW2", "FINAL_PASS"];

        if (!Statuses.includes(status)) {
            throw new Error("이력서 상태가 이상합니다.");
        }
        await sendTodayData();
        return resume;
    };

    getResumes = async (orderKey, orderValue) => {
        const delay = () => {
            return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 6) * 1000));
        };

        await delay();

        let orderBy = {};
        if (orderBy) {
            orderBy[orderKey] = orderValue && orderValue.toUpperCase() === "ASC" ? "asc" : "desc";
        } else {
            orderBy = { createdAt: "desc" };
        }

        const resumes = await this.resumesRepository.getResumes(orderBy);

        await sendTodayData();

        return resumes;
    };

    getResumeById = async (resumeId) => {
        const resume = await this.resumesRepository.getResumeById(resumeId);
        if (!resume) {
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }
        return resume;
    };

    updateResume = async (resumeId, title, content, status) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const resume = await this.resumesRepository.getResumeById(resumeId);

        if (!resume) {
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }
        const updatedResume = await this.resumesRepository.updateResume(resumeId, title, content, status);

        await sendTodayData();

        return { message: "업데이트에 성공하였습니다." };
    };

    deleteResume = async (resumeId, userId, permission) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const resume = await this.resumesRepository.getResumeById(resumeId);
        if (!resume) {
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }

        await sendTodayData();
        const deletedResume = await this.resumesRepository.deleteResume(resumeId, userId, permission);
        return { message: "삭제 성공" };
    };
}
