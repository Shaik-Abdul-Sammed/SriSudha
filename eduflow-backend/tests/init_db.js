import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDB() {
  console.log('Initializing DB Schema...');
  const client = await pool.connect();
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('Schema initialized successfully!');
    
    // Also run indexes if they exist
    try {
      const indexSql = fs.readFileSync(path.join(__dirname, '../sql/003_indexes.sql'), 'utf-8');
      await client.query(indexSql);
      console.log('Indexes initialized successfully!');
    } catch (e) {
      console.log('No indexes file found or failed to run, skipping.');
    }
  } catch (err) {
    console.error('Failed to initialize schema', err);
  } finally {
    client.release();
    pool.end();
  }
}

initDB();
