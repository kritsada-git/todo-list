import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const db = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASS || "",
	database: process.env.DB_NAME || "",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
}).promise();

export default db;