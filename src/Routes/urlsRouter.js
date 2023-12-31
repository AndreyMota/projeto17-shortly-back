import { Router } from "express";
import validateAuth from "../Middlewares/validateAuth.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { urlSchema } from "../Schemas/urlsSchema.js";
import { deleteShort, getUrlById, getUrlsShort, postUrlShorten } from "../Controllers/urlsController.js";

const routerUrl = Router();
routerUrl.post('/urls/shorten', validateAuth, validateSchema(urlSchema),  postUrlShorten);
routerUrl.get('/urls/:id', getUrlById);
routerUrl.get('/urls/open/:shortUrl', getUrlsShort);
routerUrl.delete('/urls/:id', validateAuth, deleteShort)

export default routerUrl;