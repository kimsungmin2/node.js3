import { jest } from "@jest/globals";
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

    const invalidStatus = "INVALID_STATUS";
    req.body.status = invalidStatus;
    await resumeController.createResume(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("이력서 상태가 이상합니다."));
});

test("getResumes Method", async () => {
    const req = mockRequest({}, {}, {});
    const res = mockResponse();
    await resumeController.getResumes(req, res, mockNext);

    expect(mockResumesService.getResumes).toHaveBeenCalledTimes(1);
});

test("getResumeById Method", async () => {
    const resume = { id: 1, title: "Test", content: "Content", status: "APPLY", userId: 1 };
    mockResumesService.getResumeById.mockReturnValue(resume);
    const req = mockRequest({}, { resumeId: 1 }, {});
    const res = mockResponse();
    const next = jest.fn();

    await resumeController.getResumeById(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ data: resume });
    expect(mockResumesService.getResumeById).toHaveBeenCalledTimes(1);

    mockResumesService.getResumeById.mockReturnValue(null);
    await resumeController.getResumeById(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("해당 이력서를 찾을 수 없습니다."));
});

test("updateResume Method", async () => {
    const mockReturn = { id: 1, title: "Test", content: "Content", status: "APPLY", userId: 1 };
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
    const next = jest.fn();

    await resumeController.updateResume(req, res, next);

    expect(mockResumesService.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.updateResume).toHaveBeenCalledWith(resumeId, title, content, status, userId, permission);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReturn);

    mockResumesService.getResumeById.mockReturnValue(null);
    await resumeController.updateResume(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("해당 이력서를 찾을 수 없습니다."));

    req.body.status = "INVALID_STATUS";
    req.user.permission = "Admin";
    await resumeController.updateResume(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("해당 이력서를 찾을 수 없습니다."));
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
    const next = jest.fn();

    await resumeController.deleteResume(req, res, next);

    expect(mockResumesService.getResumeById).toHaveBeenCalledTimes(6);
    expect(mockResumesService.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.deleteResume).toHaveBeenCalledWith(resumeId, userId, permission);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "삭제 성공" });

    mockResumesService.getResumeById.mockReturnValue(null);
    await resumeController.deleteResume(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("해당 이력서를 찾을 수 없습니다."));

    req.user.permission = "User";
    mockResumesService.getResumeById.mockReturnValue(mockReturn);
    await resumeController.deleteResume(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("해당 이력서를 찾을 수 없습니다."));
});
