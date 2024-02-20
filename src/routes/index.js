import express from "express";
import ResumeRouter from "./resumes.router.js";
import UsersRouter from "./users.router.js";

const router = express.Router();

router.use("/resumes/", ResumeRouter);

router.use("/users/", UsersRouter);
export default router;
