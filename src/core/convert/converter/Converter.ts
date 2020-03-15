import { TypeDef } from '../../../lang/type/TypeDef'
import { Interface } from '../../../lang/type/Interface'

export interface Converter<S, T> {
  convert(source: S): T | undefined
  getSourceType (): TypeDef
  getTargetType (): TypeDef
}

export const Converter = new Interface('Converter')

