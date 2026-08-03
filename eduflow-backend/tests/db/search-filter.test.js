import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Enhanced mock database with search capabilities
class MockSearchDatabase {
  constructor() {
    this.data = new Map();
    this.id = 0;
  }

  async create(table, data) {
    const id = ++this.id;
    const record = { id, ...data, created_at: new Date() };
    
    if (!this.data.has(table)) {
      this.data.set(table, []);
    }
    this.data.get(table).push(record);
    return record;
  }

  async search(table, query) {
    const records = this.data.get(table) || [];
    const queryLower = query.toLowerCase();
    
    return records.filter(record => {
      return Object.values(record).some(value => 
        String(value).toLowerCase().includes(queryLower)
      );
    });
  }

  async filter(table, criteria) {
    const records = this.data.get(table) || [];
    
    return records.filter(record => {
      return Object.entries(criteria).every(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          if (value.$gte !== undefined && record[key] < value.$gte) return false;
          if (value.$lte !== undefined && record[key] > value.$lte) return false;
          if (value.$gt !== undefined && record[key] <= value.$gt) return false;
          if (value.$lt !== undefined && record[key] >= value.$lt) return false;
          if (value.$in !== undefined && !value.$in.includes(record[key])) return false;
          return true;
        }
        // For non-operator values, check equality
        return record[key] === value;
      });
    });
  }

  async sort(table, field, order = 'asc') {
    const records = this.data.get(table) || [];
    const sorted = [...records].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  async aggregate(table, field, operation) {
    const records = this.data.get(table) || [];
    const values = records.map(r => r[field]).filter(v => v !== null && v !== undefined);

    switch (operation) {
      case 'count':
        return values.length;
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'avg':
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  async join(table1, table2, field1, field2) {
    const records1 = this.data.get(table1) || [];
    const records2 = this.data.get(table2) || [];

    return records1.flatMap(r1 => 
      records2
        .filter(r2 => r1[field1] === r2[field2])
        .map(r2 => ({ ...r1, ...r2 }))
    );
  }

  async getAll(table) {
    return this.data.get(table) || [];
  }
}

describe('Database Search & Filter Operations', () => {
  let db;

  beforeEach(async () => {
    // Create fresh database instance for each test
    db = new MockSearchDatabase();
    
    // Create test data
    await db.create('users', { email: 'alice@example.com', name: 'Alice Smith', role: 'admin', age: 30 });
    await db.create('users', { email: 'bob@example.com', name: 'Bob Johnson', role: 'student', age: 20 });
    await db.create('users', { email: 'charlie@example.com', name: 'Charlie Brown', role: 'student', age: 22 });
    await db.create('users', { email: 'diana@example.com', name: 'Diana Prince', role: 'teacher', age: 28 });
  });

  describe('Search Operations', () => {
    it('should search by text across all fields', async () => {
      const results = await db.search('users', 'alice');
      assert.ok(results.length > 0);
      assert.equal(results[0].email, 'alice@example.com');
    });

    it('should find records matching partial text', async () => {
      const results = await db.search('users', 'john');
      assert.ok(results.some(r => r.email === 'bob@example.com'));
    });

    it('should be case-insensitive', async () => {
      const results1 = await db.search('users', 'ALICE');
      const results2 = await db.search('users', 'alice');
      assert.equal(results1.length, results2.length);
    });

    it('should return empty for no matches', async () => {
      const results = await db.search('users', 'nonexistent');
      assert.equal(results.length, 0);
    });
  });

  describe('Filter Operations', () => {
    it('should filter by exact match', async () => {
      const results = await db.filter('users', { role: 'student' });
      assert.equal(results.length, 2);
    });

    it('should filter with greater than operator', async () => {
      const results = await db.filter('users', { age: { $gt: 25 } });
      assert.equal(results.length, 2); // alice (30) and diana (28)
    });

    it('should filter with less than operator', async () => {
      const results = await db.filter('users', { age: { $lt: 25 } });
      assert.equal(results.length, 2); // bob (20) and charlie (22)
    });

    it('should filter with range', async () => {
      const results = await db.filter('users', { age: { $gte: 22, $lte: 28 } });
      assert.equal(results.length, 2);
    });

    it('should filter with in operator', async () => {
      const results = await db.filter('users', { role: { $in: ['admin', 'teacher'] } });
      assert.equal(results.length, 2);
    });

    it('should combine multiple filters', async () => {
      const results = await db.filter('users', { role: 'student', age: { $gte: 21 } });
      assert.equal(results.length, 1); // charlie (22)
    });
  });

  describe('Sort Operations', () => {
    it('should sort in ascending order', async () => {
      const results = await db.sort('users', 'age', 'asc');
      assert.equal(results[0].age, 20);
      assert.equal(results[results.length - 1].age, 30);
    });

    it('should sort in descending order', async () => {
      const results = await db.sort('users', 'age', 'desc');
      assert.equal(results[0].age, 30);
      assert.equal(results[results.length - 1].age, 20);
    });

    it('should sort by string fields', async () => {
      const results = await db.sort('users', 'name', 'asc');
      assert.equal(results[0].name, 'Alice Smith');
    });
  });

  describe('Aggregation Operations', () => {
    it('should count records', async () => {
      const count = await db.aggregate('users', 'id', 'count');
      assert.equal(count, 4);
    });

    it('should calculate sum', async () => {
      const sum = await db.aggregate('users', 'age', 'sum');
      assert.equal(sum, 100); // 30 + 20 + 22 + 28
    });

    it('should calculate average', async () => {
      const avg = await db.aggregate('users', 'age', 'avg');
      assert.equal(avg, 25);
    });

    it('should find minimum', async () => {
      const min = await db.aggregate('users', 'age', 'min');
      assert.equal(min, 20);
    });

    it('should find maximum', async () => {
      const max = await db.aggregate('users', 'age', 'max');
      assert.equal(max, 30);
    });
  });

  describe('Join Operations', () => {
    beforeEach(async () => {
      // Create test data for courses
      await db.create('courses', { id: 1, course_id: 1, name: 'Math 101', user_id: 1 });
      await db.create('courses', { id: 2, course_id: 2, name: 'Science 101', user_id: 2 });
      await db.create('courses', { id: 3, course_id: 3, name: 'English 101', user_id: 3 });
    });

    it('should join two tables on matching field', async () => {
      const results = await db.join('users', 'courses', 'id', 'user_id');
      assert.ok(results.length > 0);
    });

    it('should preserve data from both tables', async () => {
      const results = await db.join('users', 'courses', 'id', 'user_id');
      assert.ok(results[0].email); // from users
      assert.ok(results[0].name); // from both (will be overwritten)
    });
  });

  describe('Complex Query Operations', () => {
    it('should filter and then sort', async () => {
      const filtered = await db.filter('users', { role: 'student' });
      const sorted = filtered.sort((a, b) => a.age - b.age);
      
      assert.equal(sorted[0].age, 20);
      assert.equal(sorted[1].age, 22);
    });

    it('should search and filter combined', async () => {
      const searched = await db.search('users', 'smith');
      const filtered = searched.filter(r => r.role === 'admin');
      
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].email, 'alice@example.com');
    });

    it('should handle sequential operations', async () => {
      const all = await db.getAll('users');
      const sorted = await db.sort('users', 'age', 'asc');
      const filtered = await db.filter('users', { age: { $gte: 22 } });

      assert.ok(sorted.length > 0);
      assert.ok(filtered.length > 0);
    });
  });

  describe('Performance & Edge Cases', () => {
    it('should handle large datasets', async () => {
      let largeDb = new MockSearchDatabase();
      for (let i = 0; i < 100; i++) {
        await largeDb.create('large_table', { value: i, name: `record${i}` });
      }

      const results = await largeDb.filter('large_table', { value: { $gte: 50, $lt: 100 } });
      assert.equal(results.length, 50);
    });

    it('should handle empty table search', async () => {
      const results = await db.search('empty_table', 'query');
      assert.equal(results.length, 0);
    });

    it('should handle null values in aggregation', async () => {
      let testDb = new MockSearchDatabase();
      await testDb.create('test_table', { value: null });
      await testDb.create('test_table', { value: 10 });
      await testDb.create('test_table', { value: 20 });

      const sum = await testDb.aggregate('test_table', 'value', 'sum');
      assert.equal(sum, 30);
    });
  });
});
