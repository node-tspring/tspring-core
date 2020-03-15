import { CollectionUtils } from '../../util/CollectionUtils'
import { Class } from './Class'
import { PrimitiveType } from './PrimitiveType'
import { Interface } from './Interface'
import { TypeDef } from './TypeDef'

type IteratorsProvider = (obj: any) => IterableIterator<Object> | IterableIterator<Object>[]

const itemIteratorsProviderMap = new Map<TypeDef, IteratorsProvider>()

itemIteratorsProviderMap.set(Array, (obj: Array<Object>) => obj[Symbol.iterator]())
itemIteratorsProviderMap.set(Set, (obj: Set<Object>) => obj.values())
itemIteratorsProviderMap.set(Map, (obj: Map<Object, Object>) => [obj.keys(), obj.values()])

export abstract class GenericType {
  abstract readonly name: string
  abstract getType(): TypeDef
  abstract getBoxedType(): TypeDef[]
  abstract getItemIterators(obj: any): IterableIterator<Object>[]

  static ObjectArray = GenericType.define(Array, Object)
  static StringArray = GenericType.define(Array, PrimitiveType.string)
  static NumberArray = GenericType.define(Array, PrimitiveType.number)

  static ObjectSet = GenericType.define(Set, Object)
  static StringSet = GenericType.define(Set, PrimitiveType.string)
  static NumberSet = GenericType.define(Set, PrimitiveType.number)

  static ObjectObjectMap = GenericType.define(Map, [Object, Object])
  static StringStringMap = GenericType.define(Map, [PrimitiveType.string, PrimitiveType.string])

  static define(
    type: TypeDef,
    boxedType: TypeDef | TypeDef[],
    itemIteratorsProvider?: IteratorsProvider
  ) {
    const boxedTypes = CollectionUtils.toArray(boxedType)
    if (itemIteratorsProvider == undefined) {
      itemIteratorsProvider = itemIteratorsProviderMap.get(type)
    }
    return new (class extends GenericType {
      readonly name = `${type.name}<${ boxedTypes.map(item => item.name).join(', ') }>`

      getType() {
        return type
      }

      getBoxedType() {
        return boxedTypes
      }

      getItemIterators(obj: any): IterableIterator<Object>[]  {
        if (itemIteratorsProvider == undefined) {
          return []
        }
        else {
          return CollectionUtils.toArray(itemIteratorsProvider(obj))
        }
      }
    })
  }

  static isMatch(obj: Object | undefined, type: TypeDef): boolean {
    if (type instanceof PrimitiveType) {
      return type.match(obj)
    }

    else if (type instanceof GenericType) {
      if (obj == undefined) return false
      if (obj.constructor == type.getType()) {
        const iterators = type.getItemIterators(obj)
        const boxedTypes = type.getBoxedType()

        const notMatch = boxedTypes.some((boxedType, index) => {
          if (iterators[index] == undefined) return false
          const result = iterators[index].next()
          if (result.done) return false
          return !GenericType.isMatch(result.value, boxedType)
        })

        return !notMatch
      }
      return false
    }

    else if (type instanceof Interface) {
      return Class.isImplements(obj, type)
    }

    else {
      return obj != undefined && (obj instanceof type)
    }
  }

  static isAssignableFrom(t1: TypeDef, t2: TypeDef): boolean {

    if (t1 == t2) {
      return true
    }

    else if (t1 instanceof Interface && t2 instanceof Interface) {
      // 判断接口继承关系
      return Interface.isParentInterfaceOf(t1, t2)
    }

    else if (t1 instanceof GenericType && t2 instanceof GenericType) {
      // 都是泛型类型
      const b1 = t1.getBoxedType()
      const b2 = t2.getBoxedType()
      if (b1.length != b2.length) {
        return false
      }
      const notMatch = b1.some((t, i) => {
        return !GenericType.isAssignableFrom(t, b2[i])
      })
      return !notMatch
    }

    else if (t1 instanceof GenericType) {
      return GenericType.isAssignableFrom(t1.getType(), t2)
    }
    else if (t2 instanceof GenericType) {
      return GenericType.isAssignableFrom(t1, t2.getType())
    }

    else if (t1 instanceof PrimitiveType || t2 instanceof PrimitiveType) {
      return false
    }

    else if (t1 instanceof Interface) {
      return Class.isClass(t2) && Class.isImplements(t2.prototype, t1)
    }
    else if (t2 instanceof Interface) {
      return Class.isClass(t1) && Class.isImplements(t1.prototype, t2)
    }

    else if (!Class.isClass(t1) || !Class.isClass(t2)) {
      return false
    }

    else {
      return t2.prototype instanceof t1
    }
  }

}
