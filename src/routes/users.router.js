import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { UsersService } from "../services/users.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const usersRepository = new UsersRepository(prisma);

const usersService = new UsersService(usersRepository);

const usersController = new UsersController(usersService);

router.get("/", authMiddleware, usersController.getUsers);

router.get("/:userId", authMiddleware, usersController.getUserById);

router.post("/sign-up", usersController.createUser);

router.post("/sign-in", usersController.signIn);

router.post("/token", usersController.createUserToken);

router.patch("/:userId", authMiddleware, usersController.updateUser);

router.delete("/:userId", authMiddleware, usersController.deleteUser);

export default router;
