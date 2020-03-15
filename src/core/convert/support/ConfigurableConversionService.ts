import { ConversionService } from '../ConversionService'
import { ConverterRegistry } from '../converter/ConverterRegistry'
import { Interface } from '../../../lang/type/Interface'

export interface ConfigurableConversionService extends ConversionService, ConverterRegistry {

}

export const ConfigurableConversionService = new Interface(
  'ConfigurableConversionService',
  [ConversionService, ConverterRegistry]
)

