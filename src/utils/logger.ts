// src/utils/logger.ts

/**
 * Development logger utility
 * Only logs in development mode
 */

class Logger {
    private prefix: string;

    constructor(prefix: string = 'App') {
        this.prefix = prefix;
    }

    private shouldLog(): boolean {
        return __DEV__;
    }

    private formatMessage(level: string, ...args: any[]): any[] {
        const timestamp = new Date().toISOString();
        return [`[${timestamp}] [${this.prefix}] [${level}]`, ...args];
    }

    log(...args: any[]): void {
        if (this.shouldLog()) {
            console.log(...this.formatMessage('LOG', ...args));
        }
    }

    info(...args: any[]): void {
        if (this.shouldLog()) {
            console.info(...this.formatMessage('INFO', ...args));
        }
    }

    warn(...args: any[]): void {
        if (this.shouldLog()) {
            console.warn(...this.formatMessage('WARN', ...args));
        }
    }

    error(...args: any[]): void {
        // Always log errors, even in production
        console.error(...this.formatMessage('ERROR', ...args));
    }

    debug(...args: any[]): void {
        if (this.shouldLog()) {
            console.debug(...this.formatMessage('DEBUG', ...args));
        }
    }

    group(label: string): void {
        if (this.shouldLog() && console.group) {
            console.group(label);
        }
    }

    groupEnd(): void {
        if (this.shouldLog() && console.groupEnd) {
            console.groupEnd();
        }
    }

    table(data: any): void {
        if (this.shouldLog() && console.table) {
            console.table(data);
        }
    }

    time(label: string): void {
        if (this.shouldLog() && typeof (console as any).time === 'function') {
            (console as any).time(label);
        }
    }

    timeEnd(label: string): void {
        if (this.shouldLog() && typeof (console as any).timeEnd === 'function') {
            (console as any).timeEnd(label);
        }
    }
}

// Create default logger instance
export const logger = new Logger('App');

// Export Logger class for custom instances
export default Logger;
