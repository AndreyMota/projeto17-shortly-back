import { Router } from "express";
import routerAuth from "./authRouter.js";

const router = Router()
router.use(routerAuth);

export default router