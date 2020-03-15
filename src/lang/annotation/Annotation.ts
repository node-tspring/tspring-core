import 'reflect-metadata'
import { Class } from '../type/Class'
import { BasicValueType, isBasicValueType } from '../type/Types'
import merge from 'deepmerge'
import { CollectionUtils } from '../../util/CollectionUtils'
import { Method } from '../reflect/Method'
import { Field } from '../reflect/Field'
let count = 0

type Decorator = <T>(target: any, propertyKey?: string | symbol, arg3?: TypedPropertyDescriptor<T> | number) => any

type GeneralDecorator<T, S extends Annotation.Value, P extends Annotation.Params<S>> = ParameterizedDecorator<T, S, P> & T &  AnnotationSymbol

type SimpleValue = BasicValueType | Class<Object>

export type AnnotationSymbol = {
  SYMBOL: symbol,
  extends?: Annotation[],
  parameterized?: ParameterizedDecorator<Decorator, Annotation.Value, Annotation.Params<Annotation.Value>>
}

export module ElementType {
  export type TYPE = ClassDecorator
  export type FIELD = PropertyDecorator
  export type METHOD = MethodDecorator
  export type PARAMETER = ParameterDecorator
}

export type ParameterizedDecorator<T, S extends Annotation.Value, P extends Annotation.Params<S>> = (params: S | P) => T & AnnotationSymbol & void// GeneralDecorator<T, S, P>

export type Annotation = (Decorator | ParameterizedDecorator<Decorator, Annotation.Value, Annotation.Params<Annotation.Value>>) & AnnotationSymbol

export module Annotation {
  export type Attribute = {
    aliasFor?: string | Attribute.AliasFor
    default?: any
  }

  export module Attribute {
    export type AliasFor = {
      annotation: Annotation
      attribute?: string
    }
  }

  export type Attributes = {
    [key: string]: Attribute
  }

  export type Declaration = {
    name: string
    extends?: Annotation[]
    attributes?: Attributes
  }

  export enum ElementType {
    TYPE = 'TYPE',
    FIELD = 'FIELD',
    METHOD = 'METHOD',
    PARAMETER = 'PARAMETER',
  }

  export type Value = SimpleValue | SimpleValue[] | undefined

  export type Params<T extends Value> = {
    value?: T
    target?: ElementType
  }
}

const AnnotationedMembers = Symbol('AnnotationedMembers')
const AnnotationedPropertyNames = Symbol('AnnotationedPropertyNames')
const ParamAnnotationSymbol = Symbol('ParamAnnotation')

const re = /^\s*([^(]+)@|at ([^(]+) \(/g
function getCallerName(offset: number = 0, tag: string = '') {
  console.log(`============= getCallerName: ${count++}`)
  const allMatches = new Error().stack!.match(re)
  if (allMatches) {
    const parentMatches = re.exec(allMatches[2 + offset])
    return parentMatches && (parentMatches[1] || parentMatches[2])
  }
  return undefined
}

function getDefaultParams<T>(attributes: Annotation.Attributes | undefined) {
  const result: Object = {}
  if (attributes != undefined) {
    for (const key in attributes) {
      const attribute = attributes[key]
      if (attribute.default != undefined) {
        (result as any)[key] = attribute.default
      }
    }
  }
  return result as T
}

function parseAnnotationParams <T extends Annotation.Value>(
  arg: T | Annotation.Params<T> | Object,
  attributes: Annotation.Attributes | undefined,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<any> | number
) {
  const defaultParams = getDefaultParams<Annotation.Params<T>>(attributes)
  let target: typeof arg | undefined = arg
  let params: Annotation.Params<T> = {}

  if (propertyKey == undefined && descriptor == undefined) {
    let isClassParam = false
    if (Class.isClass(arg)) {
      if (getCallerName(1) == 'DecorateConstructor') {
        return { target, params, defaultParams }
      } else {
        isClassParam = true
      }
    }

    let isArrayParam = false
    if (isClassParam || isBasicValueType(arg) || (isArrayParam = Array.isArray(arg))) {
      if (Array.isArray(defaultParams.value) && !isArrayParam) {
        arg = CollectionUtils.toArray(arg as T)
      }
      params = { value: arg } as Annotation.Params<T>
      for (const key in attributes) {
        const aliasFor = attributes[key].aliasFor
        if (aliasFor == 'value') {
          (params as any)[key] = arg
        }
      }
      target = undefined
    }
    else if (typeof arg == 'object') {
      params = arg as Annotation.Params<T>
      for (const key in attributes) {
        const aliasFor = attributes[key].aliasFor
        const newValue = (params as any)[key]
        if (typeof aliasFor == 'string' && newValue != undefined) {
          const oldValue = (params as any)[aliasFor]
          if (oldValue == undefined) {
            (params as any)[aliasFor] = newValue
          }
          else if (oldValue != newValue && !CollectionUtils.isEqual(oldValue, newValue)) {
            if (newValue == (defaultParams as any)[key]) {
              (params as any)[key] = oldValue
            }
            else {
              throw Error(`属性冲突 attributes:${key} aliasFor: ${aliasFor} oldValue: ${oldValue} newValue: ${(arg as any)[key]}`)
            }
          }
        }
      }
      // for (const key in attributes) {
      //   if (attributes[key].aliasFor == 'value') {
      //     (params as any)[key] = (params as any).value
      //   }
      // }
      target = undefined
    }
  }
  return { target, params, defaultParams }
}

function applyExtendAnnotations (
  annotations: Annotation[],
  attributes: Annotation.Attributes | undefined, params: Annotation.Params<Annotation.Value> ,
  target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any> | number
): void {
  for (const annotation of annotations) {
    const overrideParams: Object = {}
    for (const key in attributes) {
      const aliasFor = attributes[key].aliasFor
      if (typeof aliasFor == 'object' && aliasFor.annotation.SYMBOL == annotation.SYMBOL && (params as any)[key] != undefined) {
        (overrideParams as any)[aliasFor.attribute || key] = (params as any)[key]
      }
    }

    if (annotation.parameterized) {
      annotation.parameterized(overrideParams)(target, propertyKey as any, descriptor as any)
    } else {
      annotation(overrideParams)(target, propertyKey as any, descriptor as any)
    }
  }
}

function arrayMerge (t: any[], s: any[]) {
  const result = []
  for (const item of s) {
    result.push(item)
    const index = t.indexOf(item)
    if (index > -1) {
      t.splice(index, 1)
    }
  }
  return result.concat(t)
}

function mergeMetadata(annotationKey: symbol, params: Object, defaultParams: Object, target: Object, propertyKey?: string | symbol) {
  const oldValue = Reflect.getOwnMetadata(annotationKey, target, propertyKey!)
  if (oldValue == undefined) {
    params = merge(defaultParams, params, { arrayMerge })
  }
  else {
    params = merge(oldValue, params, { arrayMerge })
  }
  Reflect.defineMetadata(annotationKey, params, target, propertyKey!)
}
export module Annotation {
  export function define <T, S extends Annotation.Value, P extends Annotation.Params<S>> (declaration: Annotation.Declaration): GeneralDecorator<T, S, P> {
    const annotationKey = Symbol(declaration.name)
    const result: any = (arg1: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<T> | number) => {
      const { target, params, defaultParams } = parseAnnotationParams<S>(arg1, declaration.attributes, propertyKey, descriptor)

      const decorator: any = (target: any, propertyKey?: string | symbol, arg3?: TypedPropertyDescriptor<T> | number) => {
        if (declaration.extends) applyExtendAnnotations(declaration.extends, declaration.attributes, params, target, propertyKey, decorator)
        if (propertyKey == undefined) {
          const prototype = target.prototype
          // 类注解
          params.target = Annotation.ElementType.TYPE
          mergeMetadata(annotationKey, params, defaultParams, prototype)
        } else {
          const isStatic = Class.isClass(target)
          const clazz: Class<Object> = isStatic ? target : target.constructor
          const prototype = clazz.prototype
          const metaTarget = isStatic ? target : prototype

          let annotationedMembers: Map<string, Method | Field> = Reflect.getOwnMetadata(AnnotationedMembers, prototype)
          if (!annotationedMembers) {
            annotationedMembers = new Map<string, Method | Field>()
            Reflect.defineMetadata(AnnotationedMembers, annotationedMembers, prototype)
          }

          if (typeof arg3 == 'number') {
            // 参数注解
          }

          else if (arg3 == undefined) {
            // 属性注解
            const key = `f:${isStatic ? 's' : 'i'}:${propertyKey.toString()}`
            if (annotationedMembers.get(key) == undefined) {
              annotationedMembers.set(key, new Field(
                clazz,
                propertyKey,
                Reflect.getOwnMetadata('design:type', target, propertyKey),
                false,
                isStatic,
                false
              ))
            }
          }

          else {
            // 方法注解
            const key = `m:${isStatic ? 's' : 'i'}:${propertyKey.toString()}`
            if (annotationedMembers.get(key) == undefined) {
              annotationedMembers.set(key, new Method(
                clazz,
                propertyKey,
                target[propertyKey],
                Reflect.getOwnMetadata('design:paramtypes', target, propertyKey),
                Reflect.getOwnMetadata('design:returntype', target, propertyKey),
                false,
                isStatic,
                false
              ))
            }
          }

          let annotationedPropertyNames: Set<string | symbol> = Reflect.getOwnMetadata(AnnotationedPropertyNames, prototype)
          if (!annotationedPropertyNames) {
            annotationedPropertyNames = new Set<string | symbol>()
            Reflect.defineMetadata(AnnotationedPropertyNames, annotationedPropertyNames, prototype)
          }
          annotationedPropertyNames.add(propertyKey)

          if (typeof arg3 == 'number') {
            const paramsIndex = arg3
            // 参数注解
            params.target = Annotation.ElementType.PARAMETER
            const paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey)
            let type = paramtypes[paramsIndex]
            if (type[ParamAnnotationSymbol]) {
              type = merge(type, params, { arrayMerge })
            }
            else {
              type = params
              type[ParamAnnotationSymbol] = true
            }
            if (type.type == undefined) type.type = annotationKey
            paramtypes[paramsIndex] = type
            Reflect.defineMetadata('design:paramtypes', paramtypes, target, propertyKey)
          }
          else {
            // 方法注解
            // 属性注解
            params.target = arg3 == undefined ? Annotation.ElementType.FIELD : Annotation.ElementType.METHOD
            mergeMetadata(annotationKey, params, defaultParams, metaTarget, propertyKey)
          }
        }
      }
      if (target) {
        decorator(target, propertyKey, descriptor)
      } else {
        decorator.SYMBOL = annotationKey
        decorator.extends = declaration.extends
        decorator.parameterized = (overrideParams: Object) => result(merge(params, overrideParams, { arrayMerge }))
        return decorator
      }
    }
    Object.defineProperty(result, 'name', { value: declaration.name })
    result.SYMBOL = annotationKey
    result.extends = declaration.extends
    return result
  }

  export function getAnnotationedMembers (clazz: Class<Object>): Set<Method | Field> {
    const map: Map<string, Method | Field> = Reflect.getOwnMetadata(AnnotationedMembers, clazz.prototype)
    return map == undefined ? new Set<Method | Field>() : new Set(map.values())
  }
}
