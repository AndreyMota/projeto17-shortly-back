import { Router } from "express";
import routerAuth from "./authRouter.js";
import routerUrl from "./urlsRouter.js";

const router = Router()
router.use(routerAuth);
router.use(routerUrl);

export default router