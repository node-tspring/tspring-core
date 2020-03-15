export class IllegalStateException extends Error {
  constructor (msg: string)
  constructor (msg: string, cause: Error)

  constructor (msg: string, private cause?: Error) {
    super(msg)
  }
}
