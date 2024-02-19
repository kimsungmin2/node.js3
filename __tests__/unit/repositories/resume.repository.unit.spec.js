import { jest, expect } from "@jest/globals";
import { ResumesRepository } from "../../../src/repositories/resumes.repository.js";

let mockPrisma = {
    resumes: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

let resumesRepository = new ResumesRepository(mockPrisma);

describe("Resumes Repository Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("createResume Method", async () => {
        const mockReturn = "create Resume Return String";
        mockPrisma.resumes.create.mockReturnValue(mockReturn);
        const createResumeParams = {
            userId: 1,
            title: "createResumeTitle",
            content: "createResumeContent",
            status: "createResumeStatus",
        };
        const createdResumeData = await resumesRepository.createResume(
            createResumeParams.userId,
            createResumeParams.title,
            createResumeParams.content,
            createResumeParams.status
        );
        expect(createdResumeData).toBe(mockReturn);

        expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);

        expect(mockPrisma.resumes.create).toHaveBeenCalledWith({
            data: {
                userId: createResumeParams.userId,
                title: createResumeParams.title,
                content: createResumeParams.content,
                status: createResumeParams.status,
            },
        });
    });
    test("getResumes Method", async () => {
        const mockReturn = ["resume1", "resume2"];
        mockPrisma.resumes.findMany.mockReturnValue(mockReturn);
        const orderKey = "createdAt";
        const orderValue = "asc";
        const resumes = await resumesRepository.getResumes(orderKey, orderValue);

        expect(resumes).toBe(mockReturn);
        expect(mockPrisma.resumes.findMany).toHaveBeenCalledTimes(1);
    });

    test("getResumeById Method", async () => {
        const mockReturn = "getResumeById Return String";
        mockPrisma.resumes.findFirst.mockReturnValue(mockReturn);
        const resumeId = 1;
        const resume = await resumesRepository.getResumeById(resumeId);

        expect(resume).toBe(mockReturn);
        expect(mockPrisma.resumes.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.resumes.findFirst).toHaveBeenCalledWith({
            where: { resumeId: +resumeId },
            include: { user: { select: { name: true } } },
        });
    });

    test("updateResume Method", async () => {
        const mockReturn = "updateResume Return String";
        mockPrisma.resumes.update.mockReturnValue(mockReturn);
        const resumeId = 1;
        const title = "updateTitle";
        const content = "updateContent";
        const status = "updateStatus";
        const updatedResume = await resumesRepository.updateResume(resumeId, title, content, status);

        expect(updatedResume).toBe(mockReturn);
        expect(mockPrisma.resumes.update).toHaveBeenCalledTimes(1);
        expect(mockPrisma.resumes.update).toHaveBeenCalledWith({
            where: { resumeId: +resumeId },
            data: { title, content, status },
        });
    });

    test("deleteResume Method", async () => {
        const mockReturn = "deleteResume Return String";
        mockPrisma.resumes.delete.mockReturnValue(mockReturn);
        const resumeId = 1;
        const userId = 1;
        const deletedResume = await resumesRepository.deleteResume(resumeId, userId);

        expect(deletedResume).toBe(mockReturn);
        expect(mockPrisma.resumes.delete).toHaveBeenCalledTimes(1);
        expect(mockPrisma.resumes.delete).toHaveBeenCalledWith({
            where: { resumeId: +resumeId, userId: +userId },
        });
    });
});
