import { Class } from "../../../src/lang/type/Class"
import { SimpleParamsAnnotation } from "./Annotation/SimpleParamsAnnotation"
import { Interface, Implements } from "../../../src/lang/type/Interface"
import { PrimitiveType } from "../../../src/lang/type/PrimitiveType"
import { GenericType } from "../../../src/lang/type/GenericType"

interface InterfaceA {

}

const InterfaceA = new Interface('InterfaceA')

interface InterfaceB {

}

const InterfaceB = new Interface('InterfaceB', [InterfaceA])


@SimpleParamsAnnotation('MarkClassA')
@Implements(InterfaceA)
class ClassA implements InterfaceA {

}

class ClassB extends ClassA {

}

abstract class ClassC {

}

class ClassD extends ClassC {

}

function funcA () {

}

const instanceA = new ClassA()

test('Class.isClass', () => {
  expect(Class.isClass(ClassA)).toBe(true)
  expect(Class.isClass(ClassB)).toBe(true)
  expect(Class.isClass(ClassC)).toBe(true)
  expect(Class.isClass(Interface)).toBe(true)
  expect(Class.isClass(PrimitiveType)).toBe(true)
  expect(Class.isClass(GenericType)).toBe(true)

  expect(Class.isClass(PrimitiveType.string)).toBe(false)
  expect(Class.isClass(GenericType.StringArray)).toBe(false)

  expect(Class.isClass(Class)).toBe(false)
  expect(Class.isClass(funcA)).toBe(false)
  expect(Class.isClass(InterfaceA)).toBe(false)
  expect(Class.isClass(instanceA)).toBe(false)
  expect(Class.isClass('')).toBe(false)
  expect(Class.isClass(undefined)).toBe(false)
  expect(Class.isClass(null)).toBe(false)
  expect(Class.isClass(123)).toBe(false)
  expect(Class.isClass(0)).toBe(false)
  expect(Class.isClass(-123)).toBe(false)
  expect(Class.isClass(Symbol())).toBe(false)
  expect(Class.isClass(true)).toBe(false)
  expect(Class.isClass(false)).toBe(false)
  expect(Class.isClass({})).toBe(false)
  expect(Class.isClass([])).toBe(false)
  expect(Class.isClass(new Map())).toBe(false)
  expect(Class.isClass(new Set())).toBe(false)

  expect(Class.isClass(Function)).toBe(false)
  expect(Class.isClass(Object)).toBe(false)
  expect(Class.isClass(String)).toBe(false)
  expect(Class.isClass(Number)).toBe(false)
  expect(Class.isClass(Symbol)).toBe(false)
  expect(Class.isClass(Map)).toBe(false)
  expect(Class.isClass(Set)).toBe(false)
  expect(Class.isClass(Array)).toBe(false)

})

test('Class.isImplements', () => {
  expect(Class.isImplements(ClassA, InterfaceA)).toBe(true)
  expect(Class.isImplements(ClassB, InterfaceA)).toBe(true)

  expect(Class.isImplements(ClassC, InterfaceA)).toBe(false)

})

test('Class.isAssignableFrom', () => {
  expect(Class.isAssignableFrom(ClassA, ClassB)).toBe(true)
  expect(Class.isAssignableFrom(ClassB, ClassA)).toBe(false)

  expect(Class.isAssignableFrom(undefined, undefined)).toBe(true)
  expect(Class.isAssignableFrom(ClassA, undefined)).toBe(false)
  expect(Class.isAssignableFrom(undefined, ClassA)).toBe(false)
  expect(Class.isAssignableFrom(InterfaceA, undefined)).toBe(false)
  expect(Class.isAssignableFrom(undefined, InterfaceA)).toBe(false)

  expect(Class.isAssignableFrom(InterfaceA, InterfaceB)).toBe(true)
  expect(Class.isAssignableFrom(InterfaceB, InterfaceA)).toBe(false)

  expect(Class.isAssignableFrom(ClassA, ClassA)).toBe(true)
  expect(Class.isAssignableFrom(ClassC, ClassC)).toBe(true)
  expect(Class.isAssignableFrom(InterfaceA, ClassA)).toBe(true)
  expect(Class.isAssignableFrom(ClassA, InterfaceA)).toBe(false)

  expect(Class.isAssignableFrom(ClassA, ClassD)).toBe(false)
  expect(Class.isAssignableFrom(ClassB, ClassD)).toBe(false)

  expect(Class.isAssignableFrom(ClassC, ClassD)).toBe(true)
  expect(Class.isAssignableFrom(ClassD, ClassC)).toBe(false)

})

test('Class.getAnnotationParams', () => {
  const params = Class.getAnnotationParams<SimpleParamsAnnotation.Params>(ClassA, SimpleParamsAnnotation)
  expect(params!.value).toBe('MarkClassA')

})

test('Class.isAnnotated', () => {
  expect(Class.isAnnotated(ClassA, SimpleParamsAnnotation)).toBe(true)
})
