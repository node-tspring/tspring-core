import { GenericType } from "../../../../src/lang/type/GenericType"
import { Interface, Implements } from "../../../../src/lang/type/Interface"
import { PrimitiveType } from "../../../../src/lang/type/PrimitiveType"

interface InterfaceA {
  methodA(): void
}

const InterfaceA = new Interface('InterfaceA')

interface InterfaceB extends InterfaceA {}

const InterfaceB = new Interface('InterfaceB', [InterfaceA])

@Implements(InterfaceB)
class ClassA implements InterfaceB {
  methodA(): void {
    console.log('call methodA')
  }
}

class ClassB extends ClassA {

}

const instanceA = new ClassA()


test('GenericType.isAssignableFrom', () => {

  expect(GenericType.isAssignableFrom(PrimitiveType.string, PrimitiveType.string)).toBe(true)
  expect(GenericType.isAssignableFrom(PrimitiveType.string, Object)).toBe(false)
  expect(GenericType.isAssignableFrom('' as any, PrimitiveType.string)).toBe(false)

  expect(GenericType.isAssignableFrom(ClassA, ClassB)).toBe(true)
  expect(GenericType.isAssignableFrom(ClassA, InterfaceA)).toBe(true)
  expect(GenericType.isAssignableFrom(ClassA, InterfaceB)).toBe(true)

  expect(GenericType.isAssignableFrom(ClassB, ClassA)).toBe(false)
  expect(GenericType.isAssignableFrom(ClassB, InterfaceA)).toBe(true)
  expect(GenericType.isAssignableFrom(ClassB, InterfaceB)).toBe(true)

  expect(GenericType.isAssignableFrom(InterfaceA, InterfaceB)).toBe(true)
  expect(GenericType.isAssignableFrom(InterfaceA, ClassA)).toBe(true)
  expect(GenericType.isAssignableFrom(InterfaceA, ClassB)).toBe(true)

  expect(GenericType.isAssignableFrom(instanceA as any, InterfaceA)).toBe(false)

})
