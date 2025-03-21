import express from "express";
import {getTasks, addTask, deleteTask, getTasksByID} from "../controllers/taskController.js";


const router = express.Router();

router.get("/", getTasks);
router.post("/", addTask);
router.get("/user/:id", getTasksByID);
router.delete("/:id", deleteTask);

export default router;