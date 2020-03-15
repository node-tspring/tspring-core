import { ConversionException } from './ConversionException'
import { TypeDescriptor } from './TypeDescriptor'

export class ConversionFailedException extends ConversionException {
  constructor(sourceType: TypeDescriptor | undefined, targetType: TypeDescriptor, value: Object | undefined, cause: Error ){
    super(`Failed to convert from type [${sourceType}] to type [${targetType}] for value '${value}'`, cause)
  }
}
