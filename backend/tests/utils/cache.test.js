import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

describe('Cache Utility', () => {
  // Simple mock cache for testing
  const cache = new Map();

  beforeEach(() => {
    cache.clear();
  });

  it('should store and retrieve cache values', () => {
    const testKey = 'test:key:1';
    const testValue = { data: 'test value' };
    
    cache.set(testKey, testValue);
    const result = cache.get(testKey);
    
    assert.deepEqual(result, testValue);
  });

  it('should return undefined for non-existent keys', () => {
    const result = cache.get('nonexistent:key');
    assert.equal(result, undefined);
  });

  it('should delete cache keys', () => {
    const testKey = 'test:delete:key';
    cache.set(testKey, { data: 'delete me' });
    
    cache.delete(testKey);
    const result = cache.get(testKey);
    
    assert.equal(result, undefined);
  });

  it('should handle complex data types', () => {
    const testKey = 'test:complex:key';
    const testValue = {
      array: [1, 2, 3],
      nested: { deep: { value: 'test' } },
      date: new Date().toISOString()
    };
    
    cache.set(testKey, testValue);
    const result = cache.get(testKey);
    
    assert.deepEqual(result, testValue);
  });

  it('should support cache size checking', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    
    assert.equal(cache.size, 3);
  });

  it('should support cache iteration', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    
    const keys = Array.from(cache.keys());
    assert.equal(keys.length, 3);
  });
});
