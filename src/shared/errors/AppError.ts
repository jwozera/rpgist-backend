import { AppErrorCode, ERROR_CATALOG } from './error-catalog';

type AppErrorOptions = {
  code: AppErrorCode;
  message?: string;
  details?: unknown;
  context?: Record<string, unknown>;
  statusCodeOverride?: number;
};

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly category: string;
  public readonly details?: unknown;
  public readonly context?: Record<string, unknown>;

  constructor({ code, message, details, context, statusCodeOverride }: AppErrorOptions) {
    const catalogEntry = ERROR_CATALOG[code];
    super(message ?? catalogEntry.defaultMessage);

    this.code = code;
    this.statusCode = statusCodeOverride ?? catalogEntry.statusCode;
    this.category = catalogEntry.category;
    this.details = details;
    this.context = context;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
