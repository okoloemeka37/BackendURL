import mysql from 'mysql2'

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "url_shortener",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Connected to MySQL");
});

export default db