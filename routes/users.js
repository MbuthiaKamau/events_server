import express from "express";
import {
  getUser,
  getUsers,
  getUserFriends,
  addRemoveFriend,
  deleteUser,
  approveUser
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/", verifyToken, getUsers);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.put("/status/:id", approveUser);

// DELETE USER
router.delete("/:id", verifyToken, deleteUser);


export default router;
