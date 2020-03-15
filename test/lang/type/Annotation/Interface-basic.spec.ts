import 'reflect-metadata'
import { SimpleParamsAnnotation } from './SimpleParamsAnnotation'
import { ObjectParamsAnnotation } from './ObjectParamsAnnotation'

@SimpleParamsAnnotation
@ObjectParamsAnnotation
class ClassA {

}

@SimpleParamsAnnotation('newValue')
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
class ClassB {

}

@SimpleParamsAnnotation('newValue')
@ObjectParamsAnnotation({
  a: 201,
  b: 'b-1',
  c: {
    y: 'y-1',
    z: {
      m: 203,
    }
  }
})
class ClassC {

}

test('Annotation#basic default params', () => {

  const simpleParamsAnnotationParams: SimpleParamsAnnotation.Params = Reflect.getOwnMetadata(SimpleParamsAnnotation.SYMBOL, ClassA.prototype)
  expect(simpleParamsAnnotationParams.value).toBe('defaultStringVaule')

  let objectParamsAnnotationParams: ObjectParamsAnnotation.Params = Reflect.getOwnMetadata(ObjectParamsAnnotation.SYMBOL, ClassA.prototype)
  expect(objectParamsAnnotationParams.value).toBe(100)
  expect(objectParamsAnnotationParams.a).toBe(101)
  expect(objectParamsAnnotationParams.b).toBe('b')
  expect(objectParamsAnnotationParams.c!.x).toBe(102)
  expect(objectParamsAnnotationParams.c!.y).toBe('y')
  expect(objectParamsAnnotationParams.c!.z!.m).toBe(103)
  expect(objectParamsAnnotationParams.c!.z!.n).toBe('n')

  objectParamsAnnotationParams = Reflect.getOwnMetadata(ObjectParamsAnnotation.SYMBOL, ClassC.prototype)
  expect(objectParamsAnnotationParams.value).toBe(100)
  expect(objectParamsAnnotationParams.a).toBe(201)
  expect(objectParamsAnnotationParams.b).toBe('b-1')
  expect(objectParamsAnnotationParams.c!.x).toBe(102)
  expect(objectParamsAnnotationParams.c!.y).toBe('y-1')
  expect(objectParamsAnnotationParams.c!.z!.m).toBe(203)
  expect(objectParamsAnnotationParams.c!.z!.n).toBe('n')
})

test('Annotation#basic set params', () => {

  const simpleParamsAnnotationParams: SimpleParamsAnnotation.Params = Reflect.getOwnMetadata(SimpleParamsAnnotation.SYMBOL, ClassB.prototype)
  expect(simpleParamsAnnotationParams.value).toBe('newValue')

  const objectParamsAnnotationParams: ObjectParamsAnnotation.Params = Reflect.getOwnMetadata(ObjectParamsAnnotation.SYMBOL, ClassB.prototype)
  expect(objectParamsAnnotationParams.value).toBe(200)
  expect(objectParamsAnnotationParams.a).toBe(201)
  expect(objectParamsAnnotationParams.b).toBe('b-1')
  expect(objectParamsAnnotationParams.c!.x).toBe(202)
  expect(objectParamsAnnotationParams.c!.y).toBe('y-1')
  expect(objectParamsAnnotationParams.c!.z!.m).toBe(203)
  expect(objectParamsAnnotationParams.c!.z!.n).toBe('n-1')
})
