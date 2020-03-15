import 'reflect-metadata'
import { Class } from '../../lang/type/Class'

function getDeclaredAnnotations (Clazz: Class<Object>): Symbol[] {
  return Reflect.getMetadataKeys(Clazz) || []
}

function findAnnotation (Clazz: Class<Object>, annotationType: Function) {

}

function getAnnotation (Clazz: Class<Object>, annotationType: Symbol) {
  const annotations = AnnotationUtils.getDeclaredAnnotations(Clazz)
  for (const annotation of annotations) {
    if (annotation == annotationType) {
      return Reflect.getMetadata(annotationType, Clazz)
    }
  }
}

function getAnnotations (Clazz: Class<Object>, annotationType: Symbol): Symbol[] {
  const result: Symbol[] = []
  const annotations = AnnotationUtils.getDeclaredAnnotations(Clazz)
  for (const annotation of annotations) {
    if (annotation == annotationType) {
      result.push(Reflect.getMetadata(annotationType, Clazz))
    }
  }
  return result
}

export const AnnotationUtils = {
  getDeclaredAnnotations,
  findAnnotation,
  getAnnotation,
  getAnnotations,
}
