import express from "express";
import { userProfile,getTicketList } from "../controllers/user.controller.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const router = express.Router();

router.get("/profile", verifyAuth, userProfile);
router.get("/tickets", verifyAuth, getTicketList);

export default router;
