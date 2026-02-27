import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { generateWebsite } from "../controller/website.controller.js";

const websiteRouter = express.Router();

websiteRouter.post("/me",isAuth, generateWebsite);  // POST request, becouse hum Response lekar a rahe hai server se

export default websiteRouter;

// http:localhost:8000/api/user/me