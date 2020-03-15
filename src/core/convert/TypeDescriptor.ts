import { Class } from '../../lang/type/Class'
import { GenericType } from '../../lang/type/GenericType'
import { PrimitiveType } from '../../lang/type/PrimitiveType'
import { TypeDef } from '../../lang/type/TypeDef'

export class TypeDescriptor {
  private type: TypeDef
  private elementTypeDescriptor?: TypeDescriptor

  constructor(type: TypeDef) {
    this.type = type
    if (type instanceof GenericType) {
      const boxedType = type.getBoxedType()
      this.elementTypeDescriptor = TypeDescriptor.fromClass(boxedType[boxedType.length - 1])
    }
  }

  isInstance (obj: any) {
    return true
  }

  getType () {
    return this.type
  }

  getElementTypeDescriptor () {
    return this.elementTypeDescriptor
  }

  static fromClass(type: TypeDef) {
    return new TypeDescriptor(type)
  }

  static fromObject(obj: Object) {
    if (Array.isArray(obj)) {
      if (obj.length == 0) {
        return TypeDescriptor.fromClass(Array)
      }

      else {
        if (typeof obj[0] == 'string') {
          return TypeDescriptor.fromClass(GenericType.StringArray)
        }

        else {
          return TypeDescriptor.fromClass(GenericType.define(Array, obj[0].constructor))
        }
      }
    }
    let type: TypeDef | undefined = PrimitiveType.from(obj)
    if (type == undefined) {
      type = obj.constructor as Class<Object>
    }
    return TypeDescriptor.fromClass(type)
  }

  toString() {
    return this.type.name
  }
}
