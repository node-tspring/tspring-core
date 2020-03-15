import 'reflect-metadata'
import { ObjectParamsAnnotation } from './ObjectParamsAnnotation'
import { ChildAnnotation } from './ChildAnnotation'
import { ChildChildAnnotation } from './ChildChildAnnotation'

@ChildChildAnnotation({ a: 1000 })
class ClassA {

}

test('Annotation#basic default params', () => {

  const childChildAnnotationParams: ChildChildAnnotation.Params = Reflect.getOwnMetadata(ChildChildAnnotation.SYMBOL, ClassA.prototype)
  expect(childChildAnnotationParams.value).toBe(310)
  expect(childChildAnnotationParams.a).toBe(1000)

  const childAnnotationParams: ChildAnnotation.Params = Reflect.getOwnMetadata(ChildAnnotation.SYMBOL, ClassA.prototype)
  expect(childAnnotationParams.value).toBe(210)
  expect(childAnnotationParams.a).toBe(1000)

  const objectParamsAnnotationParams: ObjectParamsAnnotation.Params = Reflect.getOwnMetadata(ObjectParamsAnnotation.SYMBOL, ClassA.prototype)
  expect(objectParamsAnnotationParams.value).toBe(100)
  expect(objectParamsAnnotationParams.a).toBe(1000)

})
