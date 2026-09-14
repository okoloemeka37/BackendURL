import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "url_shortener",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: Test the pool connection on startup
try {
  const connection = await db.getConnection();
  console.log("Successfully connected to the database.");
  connection.release();
} catch (error) {
  console.error("Failed to connect to the database:", error.message);
}

export default db;