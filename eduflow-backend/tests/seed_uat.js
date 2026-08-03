import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  console.log('Starting Enterprise Mass Data Seeding...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('0. Altering schema for UAT requirements...');
    await client.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS type TEXT;`);
    await client.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS plan TEXT;`);

    console.log('1. Seeding Institutions...');
    await client.query(`
      INSERT INTO institutions (id, name, slug, admin_email, password_hash, type, plan) VALUES
      ('00000000-0000-0000-0000-000000000001', 'Green Valley Public School', 'green-valley', 'admin@gv.edu', 'hash', 'School', 'FREE'),
      ('00000000-0000-0000-0000-000000000002', 'ABC Engineering College', 'abc-eng', 'admin@abc.edu', 'hash', 'Engineering College', 'PRO'),
      ('00000000-0000-0000-0000-000000000003', 'Global University', 'global-uni', 'admin@global.edu', 'hash', 'University', 'ULTRA_PRO')
      ON CONFLICT (slug) DO NOTHING;
    `);

    const res = await client.query('SELECT id, slug FROM institutions');
    const instGv = res.rows.find(r => r.slug === 'green-valley').id;
    const instAbc = res.rows.find(r => r.slug === 'abc-eng').id;
    const instGlobal = res.rows.find(r => r.slug === 'global-uni').id;

    console.log('2. Seeding Green Valley...');
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'student', 'gv_student_' || g, 'GV Student ' || g, '$2b$10$X' FROM generate_series(1, 500) g ON CONFLICT DO NOTHING;`, [instGv]);
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'faculty', 'gv_faculty_' || g, 'GV Faculty ' || g, '$2b$10$X' FROM generate_series(1, 35) g ON CONFLICT DO NOTHING;`, [instGv]);
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'parent', 'gv_parent_' || g, 'GV Parent ' || g, '$2b$10$X' FROM generate_series(1, 500) g ON CONFLICT DO NOTHING;`, [instGv]);

    console.log('3. Seeding ABC Engineering...');
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'student', 'abc_student_' || g, 'ABC Student ' || g, '$2b$10$X' FROM generate_series(1, 3500) g ON CONFLICT DO NOTHING;`, [instAbc]);
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'faculty', 'abc_faculty_' || g, 'ABC Faculty ' || g, '$2b$10$X' FROM generate_series(1, 220) g ON CONFLICT DO NOTHING;`, [instAbc]);

    console.log('4. Seeding Global University...');
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'student', 'glo_student_' || g, 'GLO Student ' || g, '$2b$10$X' FROM generate_series(1, 25000) g ON CONFLICT DO NOTHING;`, [instGlobal]);
    await client.query(`INSERT INTO users (institution_id, role, username, name, password_hash)
      SELECT $1, 'faculty', 'glo_faculty_' || g, 'GLO Faculty ' || g, '$2b$10$X' FROM generate_series(1, 1200) g ON CONFLICT DO NOTHING;`, [instGlobal]);

    console.log('5. Seeding Timetable / Courses / Departments...');
    await client.query(`INSERT INTO knowledge_nodes (institution_id, node_type, node_id, properties)
      SELECT $1, 'department', 'dept-abc-' || g, '{}'::jsonb FROM generate_series(1, 8) g ON CONFLICT DO NOTHING;`, [instAbc]);
    await client.query(`INSERT INTO knowledge_nodes (institution_id, node_type, node_id, properties)
      SELECT $1, 'department', 'dept-glo-' || g, '{}'::jsonb FROM generate_series(1, 42) g ON CONFLICT DO NOTHING;`, [instGlobal]);

    console.log('6. Seeding Fake Digital Twin data for AI testing...');
    await client.query(`
      INSERT INTO digital_twins (institution_id, knowledge) VALUES
      ($1, '{"summary": "ABC Engineering College is an NBA accredited institution with 3500 students."}')
      ON CONFLICT (institution_id) DO NOTHING;
    `, [instAbc]);

    await client.query('COMMIT');
    console.log('✅ Enterprise Seeding Completed Successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
