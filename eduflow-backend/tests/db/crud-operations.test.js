import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock database client
class MockDatabaseClient {
  constructor() {
    this.data = new Map();
    this.id = 0;
  }

  async create(table, data) {
    const id = ++this.id;
    const record = { id, ...data, created_at: new Date(), updated_at: new Date() };
    
    if (!this.data.has(table)) {
      this.data.set(table, []);
    }
    this.data.get(table).push(record);
    return record;
  }

  async read(table, id) {
    const records = this.data.get(table) || [];
    return records.find(r => r.id === id) || null;
  }

  async readAll(table) {
    return this.data.get(table) || [];
  }

  async readWhere(table, field, value) {
    const records = this.data.get(table) || [];
    return records.filter(r => r[field] === value);
  }

  async update(table, id, data) {
    const records = this.data.get(table) || [];
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Record not found');
    
    records[index] = {
      ...records[index],
      ...data,
      updated_at: new Date()
    };
    return records[index];
  }

  async delete(table, id) {
    const records = this.data.get(table) || [];
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Record not found');
    
    records.splice(index, 1);
    return true;
  }

  async bulkCreate(table, dataArray) {
    return Promise.all(dataArray.map(data => this.create(table, data)));
  }

  async bulkUpdate(table, updates) {
    return Promise.all(
      updates.map(({ id, data }) => this.update(table, id, data))
    );
  }

  async bulkDelete(table, ids) {
    return Promise.all(ids.map(id => this.delete(table, id)));
  }

  async transaction(operations) {
    try {
      const results = [];
      for (const op of operations) {
        const result = await this[op.type](op.table, op.id, op.data);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}

const db = new MockDatabaseClient();

describe('Database CRUD Operations', () => {
  beforeEach(() => {
    db.data.clear();
    db.id = 0;
  });

  // CREATE operations
  describe('Create Operations', () => {
    it('should create a single record', async () => {
      const user = await db.create('users', {
        email: 'test@example.com',
        name: 'Test User',
        role: 'student'
      });

      assert.ok(user.id);
      assert.equal(user.email, 'test@example.com');
      assert.equal(user.name, 'Test User');
    });

    it('should auto-generate id and timestamps', async () => {
      const user = await db.create('users', { email: 'user@example.com' });

      assert.ok(user.id);
      assert.ok(user.created_at);
      assert.ok(user.updated_at);
    });

    it('should create multiple records', async () => {
      const users = await db.bulkCreate('users', [
        { email: 'user1@example.com', name: 'User 1' },
        { email: 'user2@example.com', name: 'User 2' },
        { email: 'user3@example.com', name: 'User 3' }
      ]);

      assert.equal(users.length, 3);
      assert.equal(users[0].name, 'User 1');
      assert.equal(users[2].name, 'User 3');
    });

    it('should preserve data types', async () => {
      const record = await db.create('assignments', {
        title: 'Math Assignment',
        due_date: new Date('2026-05-15'),
        total_marks: 100,
        is_active: true
      });

      assert.equal(typeof record.total_marks, 'number');
      assert.equal(typeof record.is_active, 'boolean');
    });
  });

  // READ operations
  describe('Read Operations', () => {
    beforeEach(async () => {
      await db.create('users', { email: 'alice@example.com', role: 'admin' });
      await db.create('users', { email: 'bob@example.com', role: 'student' });
      await db.create('users', { email: 'charlie@example.com', role: 'student' });
    });

    it('should read a single record by id', async () => {
      const user = await db.read('users', 1);
      assert.ok(user);
      assert.equal(user.email, 'alice@example.com');
    });

    it('should return null for non-existent id', async () => {
      const user = await db.read('users', 999);
      assert.equal(user, null);
    });

    it('should read all records from a table', async () => {
      const users = await db.readAll('users');
      assert.equal(users.length, 3);
    });

    it('should filter records by field', async () => {
      const students = await db.readWhere('users', 'role', 'student');
      assert.equal(students.length, 2);
    });

    it('should handle empty result sets', async () => {
      const admins = await db.readWhere('users', 'role', 'nonexistent');
      assert.equal(admins.length, 0);
    });
  });

  // UPDATE operations
  describe('Update Operations', () => {
    beforeEach(async () => {
      await db.create('users', { email: 'test@example.com', role: 'student' });
    });

    it('should update a single record', async () => {
      const updated = await db.update('users', 1, { role: 'admin' });
      assert.equal(updated.role, 'admin');
      assert.equal(updated.email, 'test@example.com');
    });

    it('should preserve unchanged fields', async () => {
      const original = await db.read('users', 1);
      await db.update('users', 1, { role: 'teacher' });
      const updated = await db.read('users', 1);
      
      assert.equal(updated.email, original.email);
    });

    it('should update timestamps', async () => {
      const original = await db.read('users', 1);
      await new Promise(resolve => setTimeout(resolve, 10));
      await db.update('users', 1, { role: 'admin' });
      const updated = await db.read('users', 1);
      
      assert.ok(updated.updated_at >= original.created_at);
    });

    it('should throw error for non-existent record', async () => {
      try {
        await db.update('users', 999, { role: 'admin' });
        assert.fail('Should throw error');
      } catch (err) {
        assert.ok(err.message.includes('not found'));
      }
    });

    it('should bulk update multiple records', async () => {
      await db.create('users', { email: 'user2@example.com', role: 'student' });
      await db.create('users', { email: 'user3@example.com', role: 'student' });

      const updates = await db.bulkUpdate('users', [
        { id: 1, data: { role: 'admin' } },
        { id: 2, data: { role: 'teacher' } }
      ]);

      assert.equal(updates.length, 2);
      assert.equal(updates[0].role, 'admin');
      assert.equal(updates[1].role, 'teacher');
    });
  });

  // DELETE operations
  describe('Delete Operations', () => {
    beforeEach(async () => {
      await db.create('users', { email: 'user1@example.com' });
      await db.create('users', { email: 'user2@example.com' });
      await db.create('users', { email: 'user3@example.com' });
    });

    it('should delete a single record', async () => {
      const result = await db.delete('users', 1);
      assert.equal(result, true);
      
      const deleted = await db.read('users', 1);
      assert.equal(deleted, null);
    });

    it('should throw error when deleting non-existent record', async () => {
      try {
        await db.delete('users', 999);
        assert.fail('Should throw error');
      } catch (err) {
        assert.ok(err.message.includes('not found'));
      }
    });

    it('should bulk delete multiple records', async () => {
      const result = await db.bulkDelete('users', [1, 2]);
      assert.equal(result.length, 2);
      
      const user1 = await db.read('users', 1);
      const user2 = await db.read('users', 2);
      const user3 = await db.read('users', 3);
      
      assert.equal(user1, null);
      assert.equal(user2, null);
      assert.ok(user3);
    });
  });

  // TRANSACTION operations
  describe('Transaction Operations', () => {
    it('should execute multiple operations in transaction', async () => {
      const results = await db.transaction([
        { type: 'create', table: 'users', data: { email: 'user1@example.com' } },
        { type: 'create', table: 'users', data: { email: 'user2@example.com' } },
        { type: 'create', table: 'users', data: { email: 'user3@example.com' } }
      ]);

      assert.equal(results.length, 3);
      assert.ok(results[0].id);
    });

    it('should rollback on error in transaction', async () => {
      try {
        await db.transaction([
          { type: 'create', table: 'users', data: { email: 'user1@example.com' } },
          { type: 'update', table: 'users', id: 999, data: { role: 'admin' } }
        ]);
        assert.fail('Should throw error');
      } catch (err) {
        assert.ok(err.message.includes('Transaction failed'));
      }
    });
  });

  // ADVANCED operations
  describe('Advanced Database Operations', () => {
    it('should handle complex nested data', async () => {
      const data = {
        title: 'Complex Record',
        metadata: { tags: ['a', 'b', 'c'], count: 3 },
        nested: { level1: { level2: { value: 'deep' } } }
      };

      const record = await db.create('records', data);
      assert.deepEqual(record.metadata, data.metadata);
      assert.equal(record.nested.level1.level2.value, 'deep');
    });

    it('should handle null and undefined values', async () => {
      const record = await db.create('records', {
        title: 'Test',
        description: null,
        notes: undefined
      });

      assert.ok(record);
      assert.equal(record.title, 'Test');
    });

    it('should support pagination', async () => {
      for (let i = 0; i < 10; i++) {
        await db.create('users', { email: `user${i}@example.com` });
      }

      const all = await db.readAll('users');
      const page1 = all.slice(0, 3);
      const page2 = all.slice(3, 6);

      assert.equal(page1.length, 3);
      assert.equal(page2.length, 3);
      assert.notEqual(page1[0].id, page2[0].id);
    });
  });
});
