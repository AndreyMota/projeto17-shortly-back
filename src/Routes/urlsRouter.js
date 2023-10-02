import { Router } from "express";
import validateAuth from "../Middlewares/validateAuth.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { urlSchema } from "../Schemas/urlsSchema.js";
import { postUrlShorten } from "../Controllers/urlsController.js";

const routerUrl = Router();
routerUrl.post('/urls/shorten', validateAuth, validateSchema(urlSchema),  postUrlShorten);

export default routerUrl;