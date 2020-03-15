import { ConversionException } from './ConversionException'
import { TypeDescriptor } from './TypeDescriptor'

export class ConverterNotFoundException extends ConversionException {
  constructor(sourceType: TypeDescriptor | undefined, targetType: TypeDescriptor) {
    super(`No converter found capable of converting from type [${sourceType}] to type [${targetType}]`)
  }
}
