import db from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secret = "your_secret_key";
// GET
export const getTasks = async (req, res) => {
	try {
		const [tasks] = await db.query("SELECT * FROM user");
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ error: "Database error" });
	}
};




// Post
export const addTask = async (req, res) => {
	const { name, username, pass } = req.body;
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(pass, salt); //

		await db.query(
			"INSERT INTO user (name, username, pass) VALUES (?, ?, ?)",
			[name, username, hashedPassword]
		);
		res.json({ message: "Task added successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to add task" });
	}
};

export const authen = async (req, res) => {
	try {
		const token = req.headers['authorization'].split(' ')[1];
		var decoded = jwt.verify(token, secret);
		res.json({status:"ok",message: "Token is valid",decoded:decoded})
	} catch (error) {
		res.status(500).json({ error: "Failed to add task" });
	}
};



// Post
export const login = async (req, res) => {
	const { username , pass} = req.body;

	try {
		const [user] = await db.query(
			"SELECT * FROM user WHERE username = ?",
			[username]
		);
		if (user.length === 0) return res.status(404).json({ message: "Invalid username or password" });

		const validPassword = await bcrypt.compare(pass, user[0].pass);
		if (!validPassword) {
			return res.status(401).json({ message: "Invalid username or password" });
		}
		const token = jwt.sign({ id: user[0].id, username: user[0].username , name : user[0].name }, secret, {
			expiresIn: "1d",
		});

		res.json({ status : 200 , message: "Login successful", token });

	} catch (error) {

		res.status(500).json({ error: "Failed to add task" });

	}
};

// DELETE
export const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		await db.query("DELETE FROM user WHERE id = ?", [id]);
		res.json({ message: "Task deleted" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete task" });
	}
};


