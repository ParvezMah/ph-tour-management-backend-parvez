import { Router } from "express";
import { validationRequest } from "../../middleware/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";




const router = Router();

router.post("/register", validationRequest(createUserZodSchema), UserControllers.creatUser);

router.get("/all-users", UserControllers.getAllUsers);


export const UserRoutes = router