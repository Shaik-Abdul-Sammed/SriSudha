import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createLogger } from '../../src/utils/logger.js';

describe('Logger Utility', () => {
  const logger = createLogger('TestLogger');

  it('should create a logger instance', () => {
    assert.ok(logger);
  });

  it('should have info method', () => {
    assert.equal(typeof logger.info, 'function');
  });

  it('should have error method', () => {
    assert.equal(typeof logger.error, 'function');
  });

  it('should have warn method', () => {
    assert.equal(typeof logger.warn, 'function');
  });

  it('should have debug method', () => {
    assert.equal(typeof logger.debug, 'function');
  });

  it('should log info level messages', () => {
    assert.doesNotThrow(() => {
      logger.info('Test info message');
    });
  });

  it('should log error level messages', () => {
    assert.doesNotThrow(() => {
      logger.error('Test error message', new Error('Test error'));
    });
  });

  it('should handle objects and metadata', () => {
    assert.doesNotThrow(() => {
      logger.info('User action', {
        userId: 123,
        action: 'login'
      });
    });
  });

  it('should handle errors with stack traces', () => {
    const error = new Error('Test error with stack');
    assert.doesNotThrow(() => {
      logger.error('An error occurred', error);
    });
  });
});
