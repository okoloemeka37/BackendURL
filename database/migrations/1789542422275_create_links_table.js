export const up = async (db) => {
  await db.query(`
       CREATE TABLE IF NOT EXISTS links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NULL,
      short VARCHAR(255) UNIQUE NOT NULL,
      original TEXT NOT NULL,
      clicks INT NOT NULL,  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )`);
};

export async function down(db) {
  await db.query("DROP TABLE IF EXISTS links");
}


export default { up, down };