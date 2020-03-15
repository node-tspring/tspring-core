import { GenericType } from "../../../../src/lang/type/GenericType"
import { PrimitiveType } from "../../../../src/lang/type/PrimitiveType"

test('GenericType.ObjectArray', () => {
  expect(GenericType.ObjectArray.name).toBe('Array<Object>')
  expect(GenericType.ObjectArray.getType()).toBe(Array)
  expect(GenericType.ObjectArray.getBoxedType()[0]).toBe(Object)
})

test('GenericType.ObjectSet', () => {
  expect(GenericType.ObjectSet.name).toBe('Set<Object>')
  expect(GenericType.ObjectSet.getType()).toBe(Set)
  expect(GenericType.ObjectSet.getBoxedType()[0]).toBe(Object)
})

test('GenericType.StringArray', () => {
  expect(GenericType.StringArray.name).toBe('Array<string>')
  expect(GenericType.StringArray.getType()).toBe(Array)
  expect(GenericType.StringArray.getBoxedType()[0]).toBe(PrimitiveType.string)
})

test('GenericType.StringSet', () => {
  expect(GenericType.StringSet.name).toBe('Set<string>')
  expect(GenericType.StringSet.getType()).toBe(Set)
  expect(GenericType.StringSet.getBoxedType()[0]).toBe(PrimitiveType.string)
})

test('GenericType.ObjectObjectMap', () => {
  expect(GenericType.ObjectObjectMap.name).toBe('Map<Object, Object>')
  expect(GenericType.ObjectObjectMap.getType()).toBe(Map)
  const boxedTypes = GenericType.ObjectObjectMap.getBoxedType()
  expect(boxedTypes[0]).toBe(Object)
  expect(boxedTypes[1]).toBe(Object)
})

test('GenericType.StringStringMap', () => {
  expect(GenericType.StringStringMap.name).toBe('Map<string, string>')
  expect(GenericType.StringStringMap.getType()).toBe(Map)
  const boxedTypes = GenericType.StringStringMap.getBoxedType()
  expect(boxedTypes[0]).toBe(PrimitiveType.string)
  expect(boxedTypes[1]).toBe(PrimitiveType.string)
})
