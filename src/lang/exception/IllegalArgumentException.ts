export class IllegalArgumentException extends Error {
  constructor(message: string, private cause?: Error) {
    super(message)
  }
}
