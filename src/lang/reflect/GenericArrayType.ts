import { Type } from './Type'
import { Interface } from '../type/Interface'

export interface GenericArrayType extends Type {
  getGenericComponentType(): Type
}

export const GenericArrayType = new Interface('GenericArrayType', [Type])
