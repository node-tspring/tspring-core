import { Interface } from '../lang/type/Interface'

export interface ErrorHandler {
	handleError(error: Error): void
}

export const ErrorHandler = new Interface('ErrorHandler')
