export abstract class ConversionException extends Error {
	constructor(message: string, private cause?: Error) {
    super(message)
  }
}
