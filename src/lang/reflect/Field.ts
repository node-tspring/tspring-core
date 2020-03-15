import { Member } from './Member'
import { Class } from '../type/Class'
import { Annotation } from '../annotation/Annotation'
import { Implements } from '../type/Interface'

@Implements(Member)
export class Field implements Member {

  static from (clazz: Class<Object>, methodName: string | symbol) {
    return new Field(clazz, methodName)
  }

  constructor (
    private declaringClass: Class<Object> ,
    private name: string | symbol,
    private type?: Class<Object>,
    private mAstract?: boolean,
    private mStatic?: boolean,
    private mFinal?: boolean
  ) {

  }

  getType() {
    return this.type || Reflect.getOwnMetadata('design:type', this.declaringClass.prototype, this.name)
  }

  getDeclaringClass(): Class<Object> {
    return this.declaringClass
  }

  getName() {
    return this.name
  }

  isAbstract(): boolean {
    return this.mAstract != undefined ? this.mAstract : false
  }

  isStatic(): boolean {
    return this.mStatic != undefined ? this.mStatic : false
  }

  isFinal(): boolean {
    return this.mFinal != undefined ? this.mFinal : false
  }

  set(obj: any, value: any) {
    Object.defineProperty(this.mStatic ? this.declaringClass : obj, this.name, {
      configurable: true,
      value
    })
  }

  get(obj: any, defaultValue?: any) {
    const descriptor = Object.getOwnPropertyDescriptor(this.mStatic ? this.declaringClass : obj, this.name)
    return (descriptor && descriptor.value != undefined) ? descriptor.value : defaultValue
  }

  isAnnotated(annotation: Annotation): boolean {
    return Reflect.hasOwnMetadata(annotation.SYMBOL, this.mStatic ? this.declaringClass : this.declaringClass.prototype, this.name)
  }

  getAnnotationParams<T extends Annotation.Params<Annotation.Value>>(annotation: Annotation): T | undefined {
    return Reflect.getOwnMetadata(annotation.SYMBOL, this.mStatic ? this.declaringClass : this.declaringClass.prototype, this.name)
  }
}
