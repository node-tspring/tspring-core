import 'reflect-metadata'
import { SimpleParamsAnnotation } from './SimpleParamsAnnotation'
import { ObjectParamsAnnotation } from './ObjectParamsAnnotation'

@ObjectParamsAnnotation
@ObjectParamsAnnotation({
  b: 'b-2',
  c: {
    y: 'y-2',
    z: {
      m: 303,
      n: 'n-2',
    }
  }
})
@ObjectParamsAnnotation({
  value: 200,
  a: 201,
  b: 'b-1',
  c: {
    x: 202,
    y: 'y-1',
    z: {
      m: 203,
      n: 'n-1'
    }
  }
})
@ObjectParamsAnnotation

@SimpleParamsAnnotation
@SimpleParamsAnnotation('newValue1')
@SimpleParamsAnnotation('newValue2')
@SimpleParamsAnnotation
class ClassA {

}

test('Interface#params override', () => {
  const simpleParamsAnnotationParams: SimpleParamsAnnotation.Params = Reflect.getOwnMetadata(SimpleParamsAnnotation.SYMBOL, ClassA.prototype)
  expect(simpleParamsAnnotationParams.value).toBe('newValue1')

  const objectParamsAnnotationParams: ObjectParamsAnnotation.Params = Reflect.getOwnMetadata(ObjectParamsAnnotation.SYMBOL, ClassA.prototype)
  expect(objectParamsAnnotationParams.value).toBe(200)
  expect(objectParamsAnnotationParams.a).toBe(201)
  expect(objectParamsAnnotationParams.b).toBe('b-2')
  expect(objectParamsAnnotationParams.c!.x).toBe(202)
  expect(objectParamsAnnotationParams.c!.y).toBe('y-2')
  expect(objectParamsAnnotationParams.c!.z!.m).toBe(303)
  expect(objectParamsAnnotationParams.c!.z!.n).toBe('n-2')
})
