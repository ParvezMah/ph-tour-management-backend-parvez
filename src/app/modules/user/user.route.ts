import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";




const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.creatUser);

router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)


export const UserRoutes = router