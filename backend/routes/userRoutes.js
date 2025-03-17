import express from "express";
import { getTasks, addTask, deleteTask , login , authen } from "../controllers/userController.js";


const router = express.Router();

router.get("/", getTasks);
router.post("/", addTask);
router.delete("/:id", deleteTask);
router.post("/login", login);
router.post("/authen", authen);

export default router;