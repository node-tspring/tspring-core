import { Type } from './Type'
import { Interface } from '../type/Interface'

export interface WildcardType extends Type {
  getUpperBounds(): Type[]
  getLowerBounds(): Type[]
}

export const WildcardType = new Interface('WildcardType', [Type])
