import { Router } from "express";
import { getUsers, postSignUp, signIn } from "../Controllers/authController.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { loginSchema, userSchema } from "../Schemas/authSchemas.js";

const routerAuth = Router();

routerAuth.get('/users', getUsers);
routerAuth.post('/signup', validateSchema(userSchema), postSignUp);
routerAuth.post('/signin', validateSchema(loginSchema), signIn);

export default routerAuth;