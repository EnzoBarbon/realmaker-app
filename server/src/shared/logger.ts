export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
  debug(message: string): void;
}

const color = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
};

export class ConsoleLogger implements Logger {
  constructor(private readonly prefix: string) {}
  info(msg: string) {
    console.log(`${color.blue}ℹ️  ${this.prefix} ${msg}${color.reset}`);
  }
  warn(msg: string) {
    console.warn(`${color.yellow}⚠️  ${this.prefix} ${msg}${color.reset}`);
  }
  error(msg: string) {
    console.error(`${color.red}❌ ${this.prefix} ${msg}${color.reset}`);
  }
  success(msg: string) {
    console.log(`${color.green}✅ ${this.prefix} ${msg}${color.reset}`);
  }
  debug(msg: string) {
    console.log(`${color.gray}🐞 ${this.prefix} ${msg}${color.reset}`);
  }
}
