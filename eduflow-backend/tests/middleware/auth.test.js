import { describe, it } from 'node:test';
import assert from 'node:assert';

// Mock JWT utilities for testing
const mockJWT = {
  sign: (payload, secret, options) => {
    return `mock_token_${JSON.stringify(payload)}`;
  },
  verify: (token, secret) => {
    if (token.startsWith('mock_token_')) {
      const jsonStr = token.replace('mock_token_', '');
      return JSON.parse(jsonStr);
    }
    throw new Error('Invalid token');
  }
};

// Mock auth functions
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };
  return {
    accessToken: mockJWT.sign(payload, 'secret', { expiresIn: '24h' }),
    refreshToken: mockJWT.sign(payload, 'secret', { expiresIn: '7d' }),
    expiresIn: '24h'
  };
};

const verifyToken = (token) => {
  try {
    return mockJWT.verify(token, 'secret');
  } catch (error) {
    return null;
  }
};

describe('Auth Utility Functions', () => {
  it('should generate tokens with valid data', () => {
    const user = {
      id: 123,
      role: 'user',
      email: 'test@example.com'
    };

    const tokens = generateTokens(user);
    assert.ok(tokens.accessToken);
    assert.ok(tokens.refreshToken);
    assert.equal(tokens.expiresIn, '24h');
  });

  it('should generate different tokens for different users', () => {
    const user1 = { id: 1, role: 'user', email: 'user1@example.com' };
    const user2 = { id: 2, role: 'admin', email: 'user2@example.com' };

    const tokens1 = generateTokens(user1);
    const tokens2 = generateTokens(user2);

    assert.notEqual(tokens1.accessToken, tokens2.accessToken);
  });

  it('should verify valid token', () => {
    const user = { id: 456, role: 'admin', email: 'admin@example.com' };
    const { accessToken } = generateTokens(user);

    const verified = verifyToken(accessToken);
    assert.ok(verified);
    assert.equal(verified.id, 456);
    assert.equal(verified.role, 'admin');
  });

  it('should return null for invalid token', () => {
    const verified = verifyToken('invalid_token_xyz');
    assert.equal(verified, null);
  });

  it('should extract user data from token', () => {
    const user = { id: 789, role: 'student', email: 'student@example.com' };
    const { accessToken } = generateTokens(user);

    const verified = verifyToken(accessToken);
    assert.equal(verified.email, 'student@example.com');
    assert.equal(verified.role, 'student');
  });

  it('should create token with all user fields', () => {
    const user = { id: 999, role: 'faculty', email: 'faculty@example.com' };
    const { accessToken } = generateTokens(user);

    const verified = verifyToken(accessToken);
    assert.ok(verified);
    assert.equal(verified.id, user.id);
    assert.equal(verified.role, user.role);
    assert.equal(verified.email, user.email);
  });
});
