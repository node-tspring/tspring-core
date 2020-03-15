import { Class } from './Class'
import { Interface } from './Interface'
import { PrimitiveType } from './PrimitiveType'
import { GenericType } from './GenericType'

export type TypeDef = Class<Object> | Interface | PrimitiveType | GenericType
