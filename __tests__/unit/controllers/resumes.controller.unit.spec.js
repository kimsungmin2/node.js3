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
    const req = mockRequest({ title: "Test", content: "Content", status: "APPLY" }, {}, { userId: 1 });
    const res = mockResponse();
    await resumeController.createResume(req, res, mockNext);

    expect(mockResumesService.createResume).toHaveBeenCalledTimes(1);
});

test("getResumes Method", async () => {
    const req = mockRequest({}, {}, {});
    const res = mockResponse();
    await resumeController.getResumes(req, res, mockNext);

    expect(mockResumesService.getResumes).toHaveBeenCalledTimes(1);
});

test("getResumeById Method", async () => {
    const req = mockRequest({}, { resumeId: 1 }, {});
    const res = mockResponse();
    await resumeController.getResumeById(req, res, mockNext);

    expect(mockResumesService.getResumeById).toHaveBeenCalledTimes(1);
});

test("updateResume Method", async () => {
    const req = mockRequest({ title: "Test", content: "Content", status: "APPLY" }, { resumeId: 1 }, { userId: 1, permission: "admin" });
    const res = mockResponse();
    await resumeController.updateResume(req, res, mockNext);

    expect(mockResumesService.updateResume).toHaveBeenCalledTimes(1);
});

test("deleteResume Method", async () => {
    const req = mockRequest({}, { resumeId: 1 }, { userId: 1 });
    const res = mockResponse();
    await resumeController.deleteResume(req, res, mockNext);

    expect(mockResumesService.deleteResume).toHaveBeenCalledTimes(1);
});
