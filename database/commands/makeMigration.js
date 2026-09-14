import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const makeMigration = (name) => {
  if (!name) {
    console.error('Migration name is required');
    process.exit(1);
  }

  const timestamp = Date.now();
  const filename = `${timestamp}_${name}.js`;
  const filePath = path.join(__dirname, '../migrations', filename);

  //getting table name
  let text=name.replace("create_",'');
      text=text.replace('_table','');
      
  // Template For Table 



  const template = `
export const up = async (db) => {
  await db.query();
};

export async function down(db) {
  await db.query("${`DROP TABLE IF EXISTS ${text}`}");
}


export default { up, down };
`;

  fs.writeFileSync(filePath, template.trim());
  console.log(`Migration created: ${filename}`);
  process.exit(0)
};

export default makeMigration;