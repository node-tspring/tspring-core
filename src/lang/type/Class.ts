import 'reflect-metadata'
import { ModuleUtils } from '../ModuleUtils'
import { Abstract } from './Types'
import { Type } from '../reflect/Type'
import { Annotation } from '../annotation/Annotation'
import { Interface } from './Interface'
import { URL } from 'url'
import path from 'path'

export interface Class<T> extends Function, Type { new (...args: any[]): T; }

const RegexClassTester = /^class\s/

export const Class = new (class extends Interface{

  isClass<T extends Object>(obj: any): obj is Class<T> {
    return typeof obj === 'function' && RegexClassTester.test(Function.prototype.toString.call(obj))
  }

  isImplements<T>(obj: any, ...interfaces: (Interface|undefined)[]): obj is T {
    if (interfaces.length > 0 && (typeof obj == 'object' ? obj != undefined : typeof obj == 'function')) {
      for (const iface of interfaces) {
        if (iface == undefined || !Reflect.hasMetadata(iface.SYMBOL, Class.isClass(obj) ? obj.prototype : obj)) {
          return false
        }
      }
      return true
    }
    return false
  }

  isAssignableFrom(c1: Class<Object> | Interface | Function | undefined, c2: Class<Object> | Interface | Function | undefined) {
    if (c1 == c2) {
      return true
    }
    else if (c1 == undefined || c2 == undefined) {
      return false
    }
    else if (c1 instanceof Interface) {
      if (c2 instanceof Interface) {
        // 都是接口，判断 c1 是否 c2 的父接口
        return Interface.isParentInterfaceOf(c1, c2)
      }
      else {
        // c2 是类或抽象类，c1 是接口，判断 c2 是否实现了 c1 接口
        return Class.isImplements(c2.prototype, c1)
      }
    } else {
      if (c2 instanceof Interface) {
        // c2 是接口 c1 是类，不匹配
        return false
      }
      else {
        // c1 c2 都是类或抽象类，判断 c2 是否继承了 c1
        return c2.prototype instanceof c1
      }
    }
  }

  isAbstract(clazz: Class<Object>): boolean {
    return this.isAnnotated(clazz, Abstract)
  }

  isStatic(clazz: Class<Object>): boolean {
    return true
  }

  isFinal(clazz: Class<Object>): boolean {
    return true
  }

  hasAnnotated(clazz: Class<Object>, annotation: Annotation): boolean {
    return Reflect.hasMetadata(annotation.SYMBOL, clazz.prototype)
  }

  isAnnotated(clazz: Class<Object>, annotation: Annotation): boolean {
    return Reflect.hasOwnMetadata(annotation.SYMBOL, clazz.prototype)
  }

  getAnnotationParams<T extends Annotation.Params<Annotation.Value>>(clazz: Class<Object>, annotation: Annotation): T | undefined {
    return Reflect.getOwnMetadata(annotation.SYMBOL, clazz.prototype)
  }

  findAnnotationParams<T extends Annotation.Params<Annotation.Value>>(clazz: Class<Object>, annotation: Annotation): T | undefined {
    return Reflect.getMetadata(annotation.SYMBOL, clazz.prototype)
  }

  forName<T>(name: string): Class<T> {
    const result = ModuleUtils.fromModuleId(name)
    if (this.isClass<T>(result)) {
      return result
    }
    throw Error(`${name} is not a class.`)
  }

  require<T>(name: string): T {
    return Class.forName(name) as any as T
  }

  getPackageName (clazz: Class<Object> | Interface) {
    return ModuleUtils.getPackageName(clazz)
  }

  getFullName(clazz: Class<Object> | Interface | string) {
    return ModuleUtils.getSimpleModuleId(clazz)
  }

  getResource(clazz: Class<Object> | Interface, resourcePath: string): URL {
    return new URL(`file:${path.resolve(path.join(ModuleUtils.getPackagePath(clazz), resourcePath))}`)
  }

})('Class', [Type])
