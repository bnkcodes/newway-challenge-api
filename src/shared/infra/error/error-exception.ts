import { ErrorCode } from './error-code';

export class ErrorException extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
  ) {
    super(message);
    this.name = 'ErrorException';
  }
}
