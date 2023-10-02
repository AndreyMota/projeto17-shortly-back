import { Router } from "express";
import routerAuth from "./authRouter.js";
import routerUrl from "./urlsRouter.js";
import validateAuth from "../Middlewares/validateAuth.js";
import { getMe } from "../Controllers/authController.js";

const router = Router()
router.use(routerAuth);
router.use(routerUrl);
router.get('/users/me', validateAuth, getMe);

export default router