export class NotFoundShortUrlError extends Error {
  constructor() {
    super('Not found short Url')
  }
}

export function isNotFoundShortUrlError(value: unknown): boolean {
  return value instanceof NotFoundShortUrlError
}
