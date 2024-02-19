import { jest } from "@jest/globals";
import { ResumesService } from "../../../src/services/resumes.service.js";

let mockResumesRepository = {
    createResume: jest.fn(),
    getResumes: jest.fn(),
    getResumeById: jest.fn(),
    updateResume: jest.fn(),
    deleteResume: jest.fn(),
};

let resumesService = new ResumesService(mockResumesRepository);

describe("Resumes Service Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("createResume Method", async () => {
        const mockReturn = "createResume Return String";
        const userId = 1;
        const title = "testTitle";
        const content = "testContent";
        mockResumesRepository.createResume.mockReturnValue(mockReturn);
        const resume = await resumesService.createResume(userId, title, content);

        expect(resume).toBe(mockReturn);
        expect(mockResumesRepository.createResume).toHaveBeenCalledTimes(1);
    });

    test("getResumes Method", async () => {
        const mockReturn = ["resume1", "resume2"];
        const orderKey = "createdAt";
        const orderValue = "desc";
        mockResumesRepository.getResumes.mockReturnValue(mockReturn);
        const resumes = await resumesService.getResumes(orderKey, orderValue);

        expect(resumes).toBe(mockReturn);
        expect(mockResumesRepository.getResumes).toHaveBeenCalledTimes(1);
    });

    test("getResumeById Method", async () => {
        const mockReturn = "getResumeById Return String";
        const resumeId = 1;
        mockResumesRepository.getResumeById.mockReturnValue(mockReturn);
        const resume = await resumesService.getResumeById(resumeId);

        expect(resume).toBe(mockReturn);
        expect(mockResumesRepository.getResumeById).toHaveBeenCalledTimes(1);
    });

    test("updateResume Method", async () => {
        const mockReturn = "updateResume Return String";
        const resumeId = 1;
        const title = "testTitle";
        const content = "testContent";
        const status = "APPLY";
        const userId = 1;
        const permission = "Admin";
        mockResumesRepository.getResumeById.mockReturnValue({ userId });
        mockResumesRepository.updateResume.mockReturnValue(mockReturn);
        const updatedResume = await resumesService.updateResume(resumeId, title, content, status, userId, permission);

        expect(updatedResume).toBe(mockReturn);
        expect(mockResumesRepository.getResumeById).toHaveBeenCalledTimes(1);
        expect(mockResumesRepository.updateResume).toHaveBeenCalledTimes(1);
    });

    test("deleteResume Method", async () => {
        const mockReturn = { message: "삭제 성공" };
        const resumeId = 1;
        const userId = 1;
        const permission = "Admin";
        mockResumesRepository.getResumeById.mockReturnValue({ userId });
        const deletedResume = await resumesService.deleteResume(resumeId, userId, permission);

        expect(deletedResume).toEqual(mockReturn);
        expect(mockResumesRepository.getResumeById).toHaveBeenCalledTimes(1);
        expect(mockResumesRepository.deleteResume).toHaveBeenCalledTimes(1);
    });
});
