import { expect, jest } from "@jest/globals";
import { ResumeController } from "../../../src/controllers/resumes.controller.js";

const mockResumesService = {
    createResume: jest.fn(),
    getResumes: jest.fn(),
    getResumeById: jest.fn(),
    updateResume: jest.fn(),
    deleteResume: jest.fn(),
};

let resumeController = new ResumeController(mockResumesService);

const mockRequest = (body, params, user) => ({
    body,
    params,
    user,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

let mockNext = jest.fn();

test("createResume Method", async () => {
    const mockReturn = "createResume Return String";
    mockResumesService.createResume.mockReturnValue(mockReturn);
    const userId = 1;
    const title = "Test";
    const content = "Content";
    const status = "APPLY";
    const req = {
        user: { userId },
        body: { title, content, status },
    };
    const res = mockResponse();
    const next = jest.fn();

    await resumeController.createResume(req, res, next);

    expect(mockResumesService.createResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.createResume).toHaveBeenCalledWith(userId, title, content, status);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "게시글 생성에 성공하였습니다" });
});

test("getResumes Method", async () => {
    const mockResumes = [
        { resumeId: 1, title: "Test1", content: "Content1", status: "APPLY", userId: 1 },
        { resumeId: 2, title: "Test2", content: "Content2", status: "APPLY", userId: 2 },
    ];
    mockResumesService.getResumes.mockReturnValue(mockResumes);
    const req = {
        query: { orderKey: "title", orderValue: "asc" },
    };
    const res = mockResponse();
    let next = jest.fn();

    await resumeController.getResumes(req, res, next);

    expect(mockResumesService.getResumes).toHaveBeenCalledTimes(1);
    expect(mockResumesService.getResumes).toHaveBeenCalledWith("title", "asc");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockResumes });
});

test("getResumeById Method - success case", async () => {
    const resume = { resumeId: 1, title: "Test", content: "Content", status: "APPLY", userId: 1 };
    mockResumesService.getResumeById.mockReturnValue(resume);
    const req = {
        params: { resumeId: 1 },
    };
    const res = mockResponse();
    let next = jest.fn();

    await resumeController.getResumeById(req, res, next);

    expect(mockResumesService.getResumeById).toHaveBeenCalledTimes(1);
    expect(mockResumesService.getResumeById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: resume });
});

test("updateResume Method", async () => {
    const mockReturn = { resumeId: 1, title: "Test", content: "Content", status: "APPLY", userId: 1 };
    mockResumesService.updateResume.mockReturnValue(mockReturn);
    mockResumesService.getResumeById.mockReturnValue(mockReturn);
    const resumeId = 1;
    const title = "updateTitle";
    const content = "updateContent";
    const status = "APPLY";
    const userId = 1;
    const permission = "Admin";
    const req = {
        params: { resumeId },
        body: { title, content, status },
        user: { userId, permission },
    };
    const res = mockResponse();
    let next = jest.fn();

    await resumeController.updateResume(req, res, next);

    expect(mockResumesService.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.updateResume).toHaveBeenCalledWith(resumeId, title, content, status, userId, permission);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReturn);

    req.user.permission = "User";
    req.user.userId = 2;
    mockResumesService.getResumeById.mockReturnValue({ ...mockReturn, userId: 1 });
    next = (err) => {
        throw err;
    };
    await expect(resumeController.updateResume(req, res, next)).rejects.toThrow("권한이 없습니다.");
});

test("deleteResume Method", async () => {
    const mockReturn = { id: 1, title: "Test", content: "Content", status: "APPLY", userId: 1 };
    mockResumesService.getResumeById.mockReturnValue(mockReturn);
    mockResumesService.deleteResume.mockReturnValue(true);
    const resumeId = 1;
    const userId = 1;
    const permission = "Admin";
    const req = {
        params: { resumeId },
        user: { userId, permission },
    };
    const res = mockResponse();
    let next = jest.fn();

    await resumeController.deleteResume(req, res, next);

    expect(mockResumesService.getResumeById).toHaveBeenCalledTimes(4);
    expect(mockResumesService.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.deleteResume).toHaveBeenCalledWith(resumeId, userId, permission);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "삭제 성공" });
    req.user.permission = "User";
    req.user.userId = 2;
    mockResumesService.getResumeById.mockReturnValue({ ...mockReturn, userId: 1 });
    next = (err) => {
        throw err;
    };
    await expect(resumeController.deleteResume(req, res, next)).rejects.toThrow("권한이 없습니다.");
});
