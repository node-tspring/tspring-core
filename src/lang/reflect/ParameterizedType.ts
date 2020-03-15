import { Type } from './Type'
import { Interface } from '../type/Interface'

export interface ParameterizedType extends Type {
  getActualTypeArguments(): Type[]

  getRawType(): Type

  getOwnerType(): Type
}

export const ParameterizedType = new Interface('ParameterizedType', [Type])
