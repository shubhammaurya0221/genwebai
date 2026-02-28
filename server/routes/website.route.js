import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { changes, generateWebsite, getAll, getWebsiteById } from "../controller/website.controller.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite);  // POST request, becouse hum Response lekar a rahe hai server se
websiteRouter.post("/update/:id", isAuth, changes);  
websiteRouter.get("/get-by-id/:id",isAuth,getWebsiteById)  // GET request, Server par response 
websiteRouter.get("/get-all",isAuth,getAll);

export default websiteRouter;

// http:localhost:8000/api/user/me