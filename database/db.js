import mysql from 'mysql2'

const db = mysql.createConnection({
  host: "bqrljmw02erm9bzpdevn-mysql.services.clever-cloud.com",
  user: "u0cpcsrsq3pvfgdj",
  password: "Fow8u3OMWzXLc0L8X1ba",
  database: "bqrljmw02erm9bzpdevn",
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Connected to MySQL");
});

export default db