import 'reflect-metadata'
import { Abstract } from '../../lang/type/Types'
import { AnnotationMetadata } from './AnnotationMetadata'
import { Class } from '../../lang/type/Class'
import { Annotation } from '../../lang/annotation/Annotation'
import { Method } from '../../lang/reflect/Method'
import { Implements } from '../../lang/type/Interface'

@Implements(AnnotationMetadata)
export class StandardAnnotationMetadata implements AnnotationMetadata {

  static from(type: Class<Object>) {
    return new StandardAnnotationMetadata(type)
  }

	constructor(private introspectedClass: Class<Object>) {
  }

  getClass(): Class<Object> {
    return this.introspectedClass
  }

  getAnnotationTypes(): symbol[] {
    return Reflect.getMetadataKeys(this.introspectedClass.prototype)
  }

  hasAnnotatedMethods(annotation: Annotation): boolean {
    const annotationedMembers = Annotation.getAnnotationedMembers(this.introspectedClass)
    for (const member of annotationedMembers) {
      if (member instanceof Method && member.isAnnotated(annotation)) return true
    }
    return false
  }

  getAnnotatedMethods(annotation: Annotation): Set<Method> {
    const annotationedMembers = Annotation.getAnnotationedMembers(this.introspectedClass)
    const result = new Set<Method>()
    for (const member of annotationedMembers) {
      if (member instanceof Method && member.isAnnotated(annotation)) {
        result.add(member)
      }
    }
    return result
  }

  getClassName() {
    return this.introspectedClass.name
  }

  isInterface() {
    return false
  }

  isAbstract() {
    return Reflect.hasOwnMetadata(Abstract.SYMBOL, this.introspectedClass.prototype)
  }

  isConcrete() {
    return !(this.isInterface() || this.isAbstract())
  }

  hasSuperClass() {
    return this.getSuperClass() != Object
  }

  getSuperClass(): Class<Object> {
    const SuperClass = Object.getPrototypeOf(this.introspectedClass)
    return SuperClass == Function.prototype
      ? Object
      : SuperClass
  }

  isAnnotated(annotation: Annotation): boolean {
    return Reflect.hasOwnMetadata(annotation.SYMBOL, this.introspectedClass.prototype)
  }

  getAnnotationParams<T extends Annotation.Params<Annotation.Value>>(annotation: Annotation): T | undefined {
    return Reflect.getOwnMetadata(annotation.SYMBOL, this.introspectedClass.prototype)
  }

}
