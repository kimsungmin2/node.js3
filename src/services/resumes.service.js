import { sendTodayData } from "../middlewares/slack.middlewares.js";

export class ResumesService {
    constructor(resumesRepository) {
        this.resumesRepository = resumesRepository;
    }

    createResume = async (userId, title, content) => {
        const status = "APPLY";
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const resume = await this.resumesRepository.createResume(userId, title, content, status);
        await sendTodayData();
        return resume;
    };

    getResumes = async (orderKey, orderValue) => {
        const delay = () => {
            return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 6) * 1000));
        };

        await delay();
        const resumes = await this.resumesRepository.getResumes(orderKey, orderValue);

        try {
            await sendTodayData();
        } catch (err) {
            next(err);
        }

        return resumes;
    };

    getResumeById = async (resumeId) => {
        const resume = await this.resumesRepository.getResumeById(resumeId);
        return resume;
    };

    updateResume = async (resumeId, title, content, status, userId, permission) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const resume = await this.resumesRepository.getResumeById(resumeId);

        if (!resume) {
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }

        try {
            await sendTodayData();
        } catch (err) {
            next(err);
        }

        const updatedResume = await this.resumesRepository.updateResume(resumeId, title, content, status);
        return updatedResume;
    };

    deleteResume = async (resumeId, userId, permission) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const resume = await this.resumesRepository.getResumeById(resumeId);
        if (!resume) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        try {
            await sendTodayData();
        } catch (err) {
            next(err);
        }

        await this.resumesRepository.deleteResume(resumeId, userId, permission);
        return { message: "삭제 성공" };
    };
}
