export class DuplicatedShortUrlError extends Error {
  constructor() {
    super('Duplicated short Url')
  }
}

export function isDuplicatedShortUrlError(value: unknown): boolean {
  return value instanceof DuplicatedShortUrlError
}
