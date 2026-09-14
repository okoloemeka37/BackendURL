import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import db from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function migrate() {
  try {
    console.log('🚀 Running migrations...\n');

    // 1. Ensure migrations table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration VARCHAR(255) NOT NULL,
        batch INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Get executed migrations
    const [rows] = await db.query(
      `SELECT migration FROM migrations`
    );
    const executed = rows.map(r => r.migration);

    // 3. Read migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    // 4. Get pending migrations
    const pending = files.filter(f => !executed.includes(f));

    if (pending.length === 0) {
      console.log('✅ Nothing to migrate.');
      return;
    }

    // 5. Get next batch number
    const [[result]] = await db.query(
      `SELECT MAX(batch) AS batch FROM migrations`
    );
    const batch = (result.batch || 0) + 1;

    // 6. Run migrations (WINDOWS-SAFE IMPORT)
    for (const file of pending) {
      console.log(`➡️  Migrating: ${file}`);

      const absolutePath = path.join(migrationsDir, file);
      const fileUrl = pathToFileURL(absolutePath).href;

      const { default: migration } = await import(fileUrl);

      if (typeof migration.up !== 'function') {
        throw new Error(`Migration ${file} has no up() method`);
      }

      await migration.up(db);

      await db.query(
        `INSERT INTO migrations (migration, batch) VALUES (?, ?)`,
        [file, batch]
      );

      console.log(` Migrated: ${file}\n`);
    }

    console.log('All migrations ran successfully!');
  } catch (err) {
    console.error('\n❌ Migration failed');
    console.error(err);
    process.exit(1); 
  } finally {
    await db.end()     
    process.exit(0)   
  }
}
