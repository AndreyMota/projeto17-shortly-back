import { Router } from "express";
import routerAuth from "./authRouter.js";
import routerUrl from "./urlsRouter.js";
import validateAuth from "../Middlewares/validateAuth.js";
import { getMe, rankUs } from "../Controllers/authController.js";

const router = Router()
router.use(routerAuth);
router.use(routerUrl);
router.get('/users/me', validateAuth, getMe);
router.get('/ranking', rankUs);

export default router