import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST || "gateway01.eu-central-1.prod.aws.tidbcloud.com",
  user: process.env.DB_USER || "2ZctqwexiZdJy6h.root",
  port: Number(process.env.DB_PORT) || 4000,
  password: process.env.DB_PASSWORD || "A81axlancHvD0IIL",
  database: process.env.DB_NAME || "urlShort",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
  // Pool Settings for Serverless & TiDB
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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