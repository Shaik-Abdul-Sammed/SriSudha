// Centralized error logging utility for monitoring and debugging

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
}

class Logger {
  constructor(name) {
    this.name = name
  }

  formatLog(level, message, data) {
    return {
      timestamp: new Date().toISOString(),
      level,
      logger: this.name,
      message,
      ...(data && { data }),
    }
  }

  debug(message, data) {
    const log = this.formatLog(LOG_LEVELS.DEBUG, message, data)
    console.debug(JSON.stringify(log))
  }

  info(message, data) {
    const log = this.formatLog(LOG_LEVELS.INFO, message, data)
    console.info(JSON.stringify(log))
  }

  warn(message, data) {
    const log = this.formatLog(LOG_LEVELS.WARN, message, data)
    console.warn(JSON.stringify(log))
  }

  error(message, error, data) {
    const log = this.formatLog(LOG_LEVELS.ERROR, message, {
      error: error?.message || error,
      stack: error?.stack,
      ...data,
    })
    console.error(JSON.stringify(log))
  }
}

export function createLogger(name) {
  return new Logger(name)
}

export default Logger
