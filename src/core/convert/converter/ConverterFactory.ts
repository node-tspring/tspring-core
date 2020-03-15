import { Converter } from './Converter'
import { Interface } from '../../../lang/type/Interface'

export interface ConverterFactory<S, R> {
	getConverter<T extends R>(): Converter<S, T>
}

export const ConverterFactory = new Interface('ConverterFactory')
