export const up = async (db) => {
   await db.query(`
    CREATE TABLE IF NOT EXISTS linkpropeties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      continent VARCHAR(255) NOT NULL,
      linkId VARCHAR(255) NOT NULL,
      userId INT NOT NULL,
      browser VARCHAR(255) NOT NULL,
      os VARCHAR(255) NOT NULL,
      device VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export async function down(db) {
  await db.query("DROP TABLE IF EXISTS linkpropeties");
}

export default { up, down };