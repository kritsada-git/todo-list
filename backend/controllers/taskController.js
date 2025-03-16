import db from "../config/db.js";


// GET
export const getTasks = async (req, res) => {
	try {
		const [tasks] = await db.query("SELECT * FROM tasks");
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
};


// PUT
export const addTask = async (req, res) => {
	const { task, detail, start_date, due_date, status } = req.body;
	try {
		await db.query(
			"INSERT INTO tasks (task, detail, start_date, due_date, status) VALUES (?, ?, ?, ?, ?)",
			[task, detail, start_date, due_date, status]
		);
		res.json({ message: "Task added successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to add task" });
	}
};

// DELETE
export const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		await db.query("DELETE FROM tasks WHERE id = ?", [id]);
		res.json({ message: "Task deleted" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete task" });
	}
};