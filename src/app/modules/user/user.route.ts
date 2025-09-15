import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";




const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.creatUser);
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.patch("/:id", checkAuth(...Object.values(Role)), UserControllers.updateUser)
// /api/v1/user/:id

export const UserRoutes = router