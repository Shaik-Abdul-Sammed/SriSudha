import axios from 'axios';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const API_URL = 'http://localhost:3001/api/v1';

async function runAITests() {
  console.log('🤖 Starting AI Feature Integration Tests...');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${name}`);
      console.error(err.response?.data || err.message);
      failed++;
    }
  };

  let token;
  try {
    const instRes = await axios.get(`${API_URL}/auth/default-institution`);
    const institutionId = instRes.data.id;
    
    // Create a real hash for password123
    const realHash = await bcrypt.hash('password123', 10);
    const client = await pool.connect();
    
    // Create an admin user for full permissions
    await client.query(`
      INSERT INTO users (institution_id, role, username, name, password_hash)
      VALUES ($1, 'admin', 'admin_test', 'Test Admin', $2)
      ON CONFLICT DO NOTHING;
    `, [institutionId, realHash]);
    
    client.release();

    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      institutionId,
      username: 'admin_test',
      password: 'password123'
    });
    token = loginRes.data.accessToken;
  } catch (err) {
    console.error('Failed to login:', err.message);
    process.exit(1);
  }

  const reqConfig = { headers: { Authorization: `Bearer ${token}` } };

  await test('Accreditation Officer API', async () => {
    const res = await axios.post(`${API_URL}/officers/accreditation/generate`, {
      reportType: 'NAAC'
    }, reqConfig);
    if (!res.data.success) throw new Error('API reported failure');
  });

  await test('Timetable Officer API', async () => {
    // Intentionally omit 'action' to test the default fallback in the controller
    const res = await axios.post(`${API_URL}/officers/timetable/generate`, {}, reqConfig);
    if (!res.data.success) throw new Error('API reported failure');
  });
  
  await test('AI Officer Chat API', async () => {
    const res = await axios.post(`${API_URL}/officers/accreditation/chat`, {
      messages: [{ role: 'user', content: 'Hello AI Officer' }]
    }, reqConfig);
    if (!res.data.reply) throw new Error('API reported failure');
    
    console.log(`    [Info] AI Chat request was processed by provider: ${res.data.provider}`);
  });

  console.log(`\\n--- AI INTEGRATION TEST RESULTS ---`);
  console.log(`Total Passed: ${passed}`);
  console.log(`Total Failed: ${failed}`);
  
  // Also run load tests via autocannon
  console.log(`\\n🚀 Setting up Load Tests with Autocannon...`);
  const { execSync } = await import('child_process');
  try {
    const out = execSync(`npx autocannon -c 100 -d 10 ${API_URL}/auth/default-institution`);
    console.log(out.toString());
    console.log('✅ PASS: Load Tests Completed Successfully');
  } catch (e) {
    console.error('❌ FAIL: Load Tests Failed', e.message);
  }
  
  pool.end();
}

runAITests();
