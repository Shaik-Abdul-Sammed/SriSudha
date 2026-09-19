import { pool } from './pool.js'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function seed() {
  console.log('Seeding database...')
  try {
    // 0. Create schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
    await pool.query(schemaSql)
    console.log('Schema created successfully.')

    // 1. Create default institutions with varying subscription tiers
    const institutions = [
      { name: 'Global Academy (Free)', short_code: 'global', tier: 'FREE', color1: '#3B82F6', color2: '#10B981' },
      { name: 'Tech Institute (Pro)', short_code: 'tech', tier: 'PRO', color1: '#8B5CF6', color2: '#EC4899' },
      { name: 'Springfield Engineering College (Ultra Pro)', short_code: 'springfield', tier: 'ULTRA_PRO', color1: '#F59E0B', color2: '#EF4444' },
      { name: 'National University (Ultra Pro+)', short_code: 'national', tier: 'ULTRA_PRO_PLUS', color1: '#06B6D4', color2: '#3B82F6' },
    ]

    for (const inst of institutions) {
      await pool.query(`
        INSERT INTO institutions (name, short_code, subscription_tier, primary_color, secondary_color)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (short_code) DO UPDATE SET 
          name = EXCLUDED.name, 
          subscription_tier = EXCLUDED.subscription_tier
      `, [inst.name, inst.short_code, inst.tier, inst.color1, inst.color2])
    }

    // Get Springfield ID for user seating
    const instRes = await pool.query(`SELECT id FROM institutions WHERE short_code = 'springfield'`)
    const instId = instRes.rows[0].id

    // 2. Create default users
    const users = [
      { role: 'student', email: 'student@springfield.edu', first: 'Demo', last: 'Student', password: 'student123' },
      { role: 'faculty', email: 'faculty@springfield.edu', first: 'Dr. S.', last: 'Kumar', password: 'faculty123' },
      { role: 'parent', email: 'parent@springfield.edu', first: 'Lakshmi', last: 'Devi', password: 'parent123' },
      { role: 'admin', email: 'admin@springfield.edu', first: 'System', last: 'Administrator', password: 'admin123' }
    ]

    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10)
      await pool.query(`
        INSERT INTO users (institution_id, role, email, password_hash, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE 
        SET password_hash = EXCLUDED.password_hash, first_name = EXCLUDED.first_name
      `, [instId, u.role, u.email, hash, u.first, u.last])
    }

    console.log('Seeding complete. Ready for multi-tenant mobile API.')
  } catch (err) {
    console.error('Seeding failed:', err)
  } finally {
    pool.end()
  }
}

seed()
