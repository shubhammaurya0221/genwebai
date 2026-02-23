import express from "express";
import { googleAuth, logOut } from "../controller/auth.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me",isAuth,getCurrentUser); 

export default userRouter;

// http:localhost:8000/api/auth/google
// http:localhost:8000/api/auth/logout