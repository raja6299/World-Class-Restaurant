export class NotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotConfiguredError';
  }
}

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogPayload {
  level: LogLevel;
  timestamp: string;
  module?: string;
  message: string;
  metadata?: Record<string, unknown>;
  error?: string;
  stack?: string;
}

export class Logger {
  private static format(payload: LogPayload): string {
    return JSON.stringify(payload);
  }

  static info(message: string, module?: string, metadata?: Record<string, unknown>) {
    const payload: LogPayload = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      module,
      message,
      metadata,
    };
    process.stdout.write(this.format(payload) + '\n');
  }

  static warn(message: string, module?: string, metadata?: Record<string, unknown>) {
    const payload: LogPayload = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      module,
      message,
      metadata,
    };
    process.stdout.write(this.format(payload) + '\n');
  }

  static error(message: string, error?: unknown, module?: string, metadata?: Record<string, unknown>) {
    const payload: LogPayload = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      module,
      message,
      metadata,
    };
    
    if (error instanceof Error) {
      payload.error = error.message;
      payload.stack = error.stack;
    } else if (error) {
      payload.error = String(error);
    }
    
    process.stderr.write(this.format(payload) + '\n');
  }

  static debug(message: string, module?: string, metadata?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      const payload: LogPayload = {
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        module,
        message,
        metadata,
      };
      process.stdout.write(this.format(payload) + '\n');
    }
  }
}
