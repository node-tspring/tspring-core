import { Converter } from './Converter'
import { ConditionalGenericConverter } from './ConditionalGenericConverter'
import { ConverterFactory } from './ConverterFactory'
import { Interface } from '../../../lang/type/Interface'

export interface ConverterRegistry {
	addConverter(converter: ConditionalGenericConverter): void
	addConverter(converter: Converter<any, any>): void
	addConverterFactory(factory: ConverterFactory<any, any>): void
}

export const ConverterRegistry = new Interface('ConverterRegistry')

