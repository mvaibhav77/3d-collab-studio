type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      return `${baseMessage} ${JSON.stringify(data)}`;
    }

    return baseMessage;
  }

  public info(message: string, data?: any): void {
    console.log(this.formatMessage("info", message, data));
  }

  public warn(message: string, data?: any): void {
    console.warn(this.formatMessage("warn", message, data));
  }

  public error(message: string, data?: any): void {
    console.error(this.formatMessage("error", message, data));
  }

  public debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatMessage("debug", message, data));
    }
  }
}

export const logger = new Logger();
