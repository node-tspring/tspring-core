import { Member } from './Member'
import { Class } from '../type/Class'
import { Annotation } from '../annotation/Annotation'
import { Implements } from '../type/Interface'

@Implements(Member)
export class Method implements Member {

  static from (clazz: Class<Object>, methodName: string | symbol) {
    return new Method(clazz, methodName)
  }

  constructor (
    private declaringClass: Class<Object>,
    private name: string | symbol,
    private executable?: Function,
    private parameterTypes?: Class<any>[],
    private returnType?: Class<Object>,
    private mAstract?: boolean,
    private mStatic?: boolean,
    private mFinal?: boolean
  )
  {

  }

  getParameterTypes(): Class<any>[] {
    return this.parameterTypes || Reflect.getOwnMetadata('design:paramtypes', this.declaringClass.prototype, this.name) || []
  }

  getReturnType() {
    return this.returnType || Reflect.getOwnMetadata('design:returntype', this.declaringClass.prototype, this.name)
  }

  getDeclaringClass() {
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

  invoke(obj: Object | undefined, args: any[]) {
    const executable: Function = this.executable || ((this.mStatic ? this.declaringClass : obj) as any)[this.name]
    return executable.apply(this.mStatic ? this.declaringClass : obj, ...args)
  }

  isAnnotated(annotation: Annotation): boolean {
    return Reflect.hasOwnMetadata(annotation.SYMBOL, this.mStatic ? this.declaringClass : this.declaringClass.prototype, this.name)
  }

  getAnnotationParams<T extends Annotation.Params<Annotation.Value>>(annotation: Annotation): T | undefined {
    return Reflect.getOwnMetadata(annotation.SYMBOL, this.mStatic ? this.declaringClass : this.declaringClass.prototype, this.name)
  }

  getParameterCount() {
    return this.getParameterTypes().length
  }
}
