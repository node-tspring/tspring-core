import { TypeDescriptor } from './TypeDescriptor'
import { Interface } from '../../lang/type/Interface'
import { TypeDef } from '../../lang/type/TypeDef'

export interface ConversionService {

	canConvert(sourceType: TypeDef , targetType: TypeDef): boolean

	canConvert(sourceType: TypeDescriptor, targetType: TypeDescriptor): boolean

	convert<T>(source: any, targetType: TypeDef): T

	convert(source: any, targetType: TypeDescriptor): Object

}

export const ConversionService = new Interface('ConversionService')
