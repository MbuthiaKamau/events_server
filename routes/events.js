import express from "express";
import { getFeedEvents, getUserEvents, approveEvent,deleteEvent, likeEvent } from "../controllers/events.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getFeedEvents);
router.get("/:userId/events", verifyToken, getUserEvents);

/* UPDATE */
router.patch("/:id/like", verifyToken, likeEvent);
router.patch("/:id/status", verifyToken, approveEvent);

// DELETE EVENT
router.delete("/:id", verifyToken, deleteEvent);


export default router;
