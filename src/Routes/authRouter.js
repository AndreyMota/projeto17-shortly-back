import { Router } from "express";
import { getUsers, postSignUp } from "../Controllers/authController.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { userSchema } from "../Schemas/authSchemas.js";

const routerAuth = Router();

routerAuth.get('/users', getUsers);
routerAuth.post('/signup', validateSchema(userSchema), postSignUp)

export default routerAuth;