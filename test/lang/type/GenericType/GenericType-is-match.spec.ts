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
const instanceB = new ClassB()

const InterfaceAArray = GenericType.define(Array, InterfaceA)
const interfaceAArray: InterfaceA[] = []
interfaceAArray.push(instanceA)

const InterfaceAArraySet = GenericType.define(Set, InterfaceAArray)
const interfaceAArraySet = new Set<InterfaceA[]>()
interfaceAArraySet.add(interfaceAArray)

const emptyArray:any[] = []
const stringArray = ['abc']
const numberArray = [123]
const objectArray = [instanceA]

const emptySet = new Set()
const stringSet = new Set<string>()
stringSet.add(stringArray[0])

const numberSet = new Set<number>()
numberSet.add(numberArray[0])

const objectSet = new Set<Object>()
objectSet.add(instanceA)

const emptyMap = new Map()
const stringStringMap = new Map<string, string>()
stringStringMap.set('key', 'value')

const objectObjectMap = new Map<Object, Object>()
objectObjectMap.set(instanceA, instanceA)

test('GenericType.isMatch PrimitiveType', () => {
  expect(GenericType.isMatch('abc', PrimitiveType.string)).toBe(true)
  expect(GenericType.isMatch(123, PrimitiveType.number)).toBe(true)
  expect(GenericType.isMatch(true, PrimitiveType.boolean)).toBe(true)
  expect(GenericType.isMatch(false, PrimitiveType.boolean)).toBe(true)
  expect(GenericType.isMatch(Symbol(), PrimitiveType.symbol)).toBe(true)
  expect(GenericType.isMatch({}, PrimitiveType.object)).toBe(true)
  expect(GenericType.isMatch(() => {}, PrimitiveType.function)).toBe(true)
  expect(GenericType.isMatch(undefined, PrimitiveType.undefined)).toBe(true)

  expect(GenericType.isMatch(instanceA, PrimitiveType.string)).toBe(false)
  expect(GenericType.isMatch(instanceA, PrimitiveType.object)).toBe(false)

})

test('GenericType.isMatch class', () => {
  expect(GenericType.isMatch(instanceA, ClassA)).toBe(true)
  expect(GenericType.isMatch(instanceA, ClassB)).toBe(false)

  expect(GenericType.isMatch(instanceB, ClassA)).toBe(true)
  expect(GenericType.isMatch(instanceB, ClassB)).toBe(true)
})

test('GenericType.isMatch interface', () => {
  expect(GenericType.isMatch(instanceA, InterfaceA)).toBe(true)
  expect(GenericType.isMatch(instanceA, InterfaceB)).toBe(true)
  expect(GenericType.isMatch(interfaceAArray, InterfaceAArray)).toBe(true)
  expect(GenericType.isMatch(interfaceAArraySet, InterfaceAArraySet)).toBe(true)
})

test('GenericType.isMatch empty collections', () => {
  expect(GenericType.isMatch(emptyArray, GenericType.ObjectArray)).toBe(true)
  expect(GenericType.isMatch(emptyArray, GenericType.StringArray)).toBe(true)
  expect(GenericType.isMatch(emptyArray, GenericType.NumberArray)).toBe(true)

  expect(GenericType.isMatch(emptyArray, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(emptyArray, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(emptyArray, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(emptyArray, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(emptyArray, GenericType.ObjectObjectMap)).toBe(false)


  expect(GenericType.isMatch(emptySet, GenericType.StringSet)).toBe(true)
  expect(GenericType.isMatch(emptySet, GenericType.NumberSet)).toBe(true)
  expect(GenericType.isMatch(emptySet, GenericType.ObjectSet)).toBe(true)

  expect(GenericType.isMatch(emptySet, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(emptySet, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(emptySet, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(emptySet, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(emptySet, GenericType.ObjectObjectMap)).toBe(false)


  expect(GenericType.isMatch(emptyMap, GenericType.StringStringMap)).toBe(true)
  expect(GenericType.isMatch(emptyMap, GenericType.ObjectObjectMap)).toBe(true)

  expect(GenericType.isMatch(emptyMap, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(emptyMap, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(emptyMap, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(emptyMap, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(emptyMap, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(emptyMap, GenericType.ObjectSet)).toBe(false)
})

test('GenericType.isMatch GenericType string array', () => {
  expect(GenericType.isMatch(stringArray, GenericType.StringArray)).toBe(true)

  expect(GenericType.isMatch(stringArray, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(stringArray, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(stringArray, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(stringArray, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(stringArray, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(stringArray, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(stringArray, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType number array', () => {
  expect(GenericType.isMatch(numberArray, GenericType.NumberArray)).toBe(true)

  expect(GenericType.isMatch(numberArray, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(numberArray, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(numberArray, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(numberArray, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(numberArray, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(numberArray, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(numberArray, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType object array', () => {
  expect(GenericType.isMatch(objectArray, GenericType.ObjectArray)).toBe(true)

  expect(GenericType.isMatch(objectArray, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(objectArray, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(objectArray, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(objectArray, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(objectArray, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(objectArray, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(objectArray, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType string set', () => {
  expect(GenericType.isMatch(stringSet, GenericType.StringSet)).toBe(true)

  expect(GenericType.isMatch(stringSet, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(stringSet, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(stringSet, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(stringSet, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(stringSet, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(stringSet, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(stringSet, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType number set', () => {
  expect(GenericType.isMatch(numberSet, GenericType.NumberSet)).toBe(true)

  expect(GenericType.isMatch(numberSet, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(numberSet, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(numberSet, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(numberSet, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(numberSet, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(numberSet, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(numberSet, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType object set', () => {
  expect(GenericType.isMatch(objectSet, GenericType.ObjectSet)).toBe(true)

  expect(GenericType.isMatch(objectSet, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(objectSet, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(objectSet, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(objectSet, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(objectSet, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(objectSet, GenericType.StringStringMap)).toBe(false)
  expect(GenericType.isMatch(objectSet, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType string string map', () => {
  expect(GenericType.isMatch(stringStringMap, GenericType.StringStringMap)).toBe(true)

  expect(GenericType.isMatch(stringStringMap, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(stringStringMap, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(stringStringMap, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(stringStringMap, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(stringStringMap, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(stringStringMap, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(stringStringMap, GenericType.ObjectObjectMap)).toBe(false)
})

test('GenericType.isMatch GenericType Object Object map', () => {
  expect(GenericType.isMatch(objectObjectMap, GenericType.ObjectObjectMap)).toBe(true)

  expect(GenericType.isMatch(objectObjectMap, GenericType.ObjectArray)).toBe(false)
  expect(GenericType.isMatch(objectObjectMap, GenericType.StringArray)).toBe(false)
  expect(GenericType.isMatch(objectObjectMap, GenericType.NumberArray)).toBe(false)
  expect(GenericType.isMatch(objectObjectMap, GenericType.StringSet)).toBe(false)
  expect(GenericType.isMatch(objectObjectMap, GenericType.NumberSet)).toBe(false)
  expect(GenericType.isMatch(objectObjectMap, GenericType.ObjectSet)).toBe(false)
  expect(GenericType.isMatch(objectObjectMap, GenericType.StringStringMap)).toBe(false)
})
