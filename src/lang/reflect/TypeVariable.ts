import { Type } from './Type'
import { GenericDeclaration } from './GenericDeclaration'
import { Interface } from '../type/Interface'

export interface TypeVariable<D extends GenericDeclaration> extends Type /*, AnnotatedElement*/ {
  getBounds(): Type[]
  getGenericDeclaration(): D
  getName(): string
  // getAnnotatedBounds(): AnnotatedType[]
}

export const TypeVariable = new Interface('TypeVariable', [Type])
