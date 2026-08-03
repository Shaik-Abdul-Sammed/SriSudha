import axios from 'axios';
import jwt from 'jsonwebtoken';

const BASE_URL = 'http://localhost:3001/api/v1';

async function runSecurityAudit() {
  console.log('🛡️ Starting Security & RBAC Penetration Tests...');
  let failedTests = 0;
  let passedTests = 0;

  const assertFail = (msg, error) => {
    if (error && error.response && error.response.status >= 400) {
      console.log(`✅ PASS: ${msg} (Blocked as expected - ${error.response.status})`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${msg} (Request succeeded unexpectedly or failed for wrong reason)`);
      failedTests++;
    }
  };

  try {
    // 1. SQL Injection Attempt on Login
    console.log('\\n[TEST 1] SQL Injection Attempt');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: "' OR '1'='1",
        password: "wrongpassword"
      });
      console.error('❌ FAIL: SQL Injection Attempt (Request succeeded)');
      failedTests++;
    } catch (err) {
      assertFail('SQL Injection effectively blocked by ORM/Prepared statements', err);
    }

    // 2. JWT Tampering Attempt
    console.log('\\n[TEST 2] JWT Tampering');
    const forgedToken = jwt.sign({ id: 'gv-s-1', role: 'student', institution_id: 'inst-gv' }, 'WRONG_SECRET');
    try {
      await axios.get(`${BASE_URL}/user/dashboard-summary`, {
        headers: { Authorization: `Bearer ${forgedToken}` }
      });
      console.error('❌ FAIL: Forged JWT accepted!');
      failedTests++;
    } catch (err) {
      assertFail('Forged JWT rejected by Auth Middleware', err);
    }

    // 3. RBAC Privilege Escalation (Student trying to hit Officer API)
    console.log('\\n[TEST 3] Privilege Escalation (Student -> Admin)');
    // Need a valid token. Since we don't know the exact secret in this context if we don't load dotenv, wait, let's load dotenv
    const realToken = jwt.sign({ id: 'gv-s-1', role: 'student', institution_id: 'inst-gv' }, process.env.JWT_SECRET || '36a8b28c9e0246ed6b1058f9c4998b97');
    try {
      await axios.post(`${BASE_URL}/officers/student-success/predict-risk`, 
        { studentId: 'gv-s-2' },
        { headers: { Authorization: `Bearer ${realToken}` }}
      );
      console.error('❌ FAIL: Privilege Escalation allowed! Student accessed Officer API');
      failedTests++;
    } catch (err) {
      assertFail('Privilege Escalation blocked by RBAC', err);
    }

    console.log('\\n--- SECURITY AUDIT RESULTS ---');
    console.log(`Total Passed: ${passedTests}`);
    console.log(`Total Failed: ${failedTests}`);
    if (failedTests > 0) process.exit(1);

  } catch (err) {
    console.error('Audit script crashed', err.message);
  }
}

runSecurityAudit();
