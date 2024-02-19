import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ResumeController } from "../controllers/resumes.controller.js";
import { ResumesRepository } from "../repositories/resumes.repository.js";
import { ResumesService } from "../services/resumes.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
// PostsController의 인스턴스를 생성합니다.
const resumesController = new ResumeController(resumesService);

/** 게시글 조회 API **/
router.get("/", authMiddleware, resumesController.getResumes);

/** 게시글 상세 조회 API **/
router.get("/:resumeId", authMiddleware, resumesController.getResumeById);

/** 게시글 작성 API **/
router.post("/", authMiddleware, resumesController.createResume);

/** 게시글 수정 API **/
router.put("/:resumeId", authMiddleware, resumesController.updateResume);

/** 게시글 삭제 API **/
router.delete("/:resumeId", authMiddleware, resumesController.deleteResume);

export default router;
