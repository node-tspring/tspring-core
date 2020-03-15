import { PrimitiveType } from "../../../src/lang/type/PrimitiveType"

class ClassA {}

function funA () {}

const symbolA = Symbol('symbolA')

const instanceA = new ClassA

const objectString = new String('abc')

test('PrimitiveType.string.match', () => {
  expect(PrimitiveType.string.match('')).toBe(true)
  expect(PrimitiveType.string.match('123')).toBe(true)
  expect(PrimitiveType.string.match('abc')).toBe(true)

  expect(PrimitiveType.string.match(objectString)).toBe(false)
  expect(PrimitiveType.string.match(123)).toBe(false)
  expect(PrimitiveType.string.match(0)).toBe(false)
  expect(PrimitiveType.string.match(-123)).toBe(false)
  expect(PrimitiveType.string.match(symbolA)).toBe(false)
  expect(PrimitiveType.string.match(true)).toBe(false)
  expect(PrimitiveType.string.match(false)).toBe(false)
  expect(PrimitiveType.string.match(undefined)).toBe(false)
  expect(PrimitiveType.string.match(null)).toBe(false)
  expect(PrimitiveType.string.match({})).toBe(false)
  expect(PrimitiveType.string.match([])).toBe(false)
  expect(PrimitiveType.string.match(funA)).toBe(false)
  expect(PrimitiveType.string.match(ClassA)).toBe(false)
  expect(PrimitiveType.string.match(instanceA)).toBe(false)

})

test('PrimitiveType.number.match', () => {
  expect(PrimitiveType.number.match(123)).toBe(true)
  expect(PrimitiveType.number.match(0)).toBe(true)
  expect(PrimitiveType.number.match(-123)).toBe(true)

  expect(PrimitiveType.number.match('')).toBe(false)
  expect(PrimitiveType.number.match('123')).toBe(false)
  expect(PrimitiveType.number.match('abc')).toBe(false)
  expect(PrimitiveType.number.match(objectString)).toBe(false)
  expect(PrimitiveType.number.match(symbolA)).toBe(false)
  expect(PrimitiveType.number.match(true)).toBe(false)
  expect(PrimitiveType.number.match(false)).toBe(false)
  expect(PrimitiveType.number.match(undefined)).toBe(false)
  expect(PrimitiveType.number.match(null)).toBe(false)
  expect(PrimitiveType.number.match({})).toBe(false)
  expect(PrimitiveType.number.match([])).toBe(false)
  expect(PrimitiveType.number.match(funA)).toBe(false)
  expect(PrimitiveType.number.match(ClassA)).toBe(false)
  expect(PrimitiveType.number.match(instanceA)).toBe(false)

})

test('PrimitiveType.bigint.match', () => {

  expect(PrimitiveType.bigint.match('')).toBe(false)
  expect(PrimitiveType.bigint.match('123')).toBe(false)
  expect(PrimitiveType.bigint.match('abc')).toBe(false)
  expect(PrimitiveType.bigint.match(objectString)).toBe(false)
  expect(PrimitiveType.bigint.match(123)).toBe(false)
  expect(PrimitiveType.bigint.match(0)).toBe(false)
  expect(PrimitiveType.bigint.match(-123)).toBe(false)
  expect(PrimitiveType.bigint.match(symbolA)).toBe(false)
  expect(PrimitiveType.bigint.match(true)).toBe(false)
  expect(PrimitiveType.bigint.match(false)).toBe(false)
  expect(PrimitiveType.bigint.match(undefined)).toBe(false)
  expect(PrimitiveType.bigint.match(null)).toBe(false)
  expect(PrimitiveType.bigint.match({})).toBe(false)
  expect(PrimitiveType.bigint.match([])).toBe(false)
  expect(PrimitiveType.bigint.match(funA)).toBe(false)
  expect(PrimitiveType.bigint.match(ClassA)).toBe(false)
  expect(PrimitiveType.bigint.match(instanceA)).toBe(false)

})

test('PrimitiveType.symbol.match', () => {
  expect(PrimitiveType.symbol.match(symbolA)).toBe(true)

  expect(PrimitiveType.symbol.match('')).toBe(false)
  expect(PrimitiveType.symbol.match('123')).toBe(false)
  expect(PrimitiveType.symbol.match('abc')).toBe(false)
  expect(PrimitiveType.symbol.match(objectString)).toBe(false)
  expect(PrimitiveType.symbol.match(123)).toBe(false)
  expect(PrimitiveType.symbol.match(0)).toBe(false)
  expect(PrimitiveType.symbol.match(-123)).toBe(false)
  expect(PrimitiveType.symbol.match(true)).toBe(false)
  expect(PrimitiveType.symbol.match(false)).toBe(false)
  expect(PrimitiveType.symbol.match(undefined)).toBe(false)
  expect(PrimitiveType.symbol.match(null)).toBe(false)
  expect(PrimitiveType.symbol.match({})).toBe(false)
  expect(PrimitiveType.symbol.match([])).toBe(false)
  expect(PrimitiveType.symbol.match(funA)).toBe(false)
  expect(PrimitiveType.symbol.match(ClassA)).toBe(false)
  expect(PrimitiveType.symbol.match(instanceA)).toBe(false)

})

test('PrimitiveType.boolean.match', () => {
  expect(PrimitiveType.boolean.match(true)).toBe(true)
  expect(PrimitiveType.boolean.match(false)).toBe(true)

  expect(PrimitiveType.boolean.match('')).toBe(false)
  expect(PrimitiveType.boolean.match('123')).toBe(false)
  expect(PrimitiveType.boolean.match('abc')).toBe(false)
  expect(PrimitiveType.boolean.match(objectString)).toBe(false)
  expect(PrimitiveType.boolean.match(123)).toBe(false)
  expect(PrimitiveType.boolean.match(0)).toBe(false)
  expect(PrimitiveType.boolean.match(-123)).toBe(false)
  expect(PrimitiveType.boolean.match(symbolA)).toBe(false)
  expect(PrimitiveType.boolean.match(undefined)).toBe(false)
  expect(PrimitiveType.boolean.match(null)).toBe(false)
  expect(PrimitiveType.boolean.match({})).toBe(false)
  expect(PrimitiveType.boolean.match([])).toBe(false)
  expect(PrimitiveType.boolean.match(funA)).toBe(false)
  expect(PrimitiveType.boolean.match(ClassA)).toBe(false)
  expect(PrimitiveType.boolean.match(instanceA)).toBe(false)

})

test('PrimitiveType.undefined.match', () => {
  expect(PrimitiveType.undefined.match(undefined)).toBe(true)

  expect(PrimitiveType.undefined.match('')).toBe(false)
  expect(PrimitiveType.undefined.match('123')).toBe(false)
  expect(PrimitiveType.undefined.match('abc')).toBe(false)
  expect(PrimitiveType.undefined.match(objectString)).toBe(false)
  expect(PrimitiveType.undefined.match(123)).toBe(false)
  expect(PrimitiveType.undefined.match(0)).toBe(false)
  expect(PrimitiveType.undefined.match(-123)).toBe(false)
  expect(PrimitiveType.undefined.match(symbolA)).toBe(false)
  expect(PrimitiveType.undefined.match(true)).toBe(false)
  expect(PrimitiveType.undefined.match(false)).toBe(false)
  expect(PrimitiveType.undefined.match(null)).toBe(false)
  expect(PrimitiveType.undefined.match({})).toBe(false)
  expect(PrimitiveType.undefined.match([])).toBe(false)
  expect(PrimitiveType.undefined.match(funA)).toBe(false)
  expect(PrimitiveType.undefined.match(ClassA)).toBe(false)
  expect(PrimitiveType.undefined.match(instanceA)).toBe(false)

})

test('PrimitiveType.object.match', () => {
  expect(PrimitiveType.object.match({})).toBe(true)

  expect(PrimitiveType.object.match('')).toBe(false)
  expect(PrimitiveType.object.match('123')).toBe(false)
  expect(PrimitiveType.object.match('abc')).toBe(false)
  expect(PrimitiveType.object.match(objectString)).toBe(false)
  expect(PrimitiveType.object.match(123)).toBe(false)
  expect(PrimitiveType.object.match(0)).toBe(false)
  expect(PrimitiveType.object.match(-123)).toBe(false)
  expect(PrimitiveType.object.match(symbolA)).toBe(false)
  expect(PrimitiveType.object.match(true)).toBe(false)
  expect(PrimitiveType.object.match(false)).toBe(false)
  expect(PrimitiveType.object.match(undefined)).toBe(false)
  expect(PrimitiveType.object.match(null)).toBe(false)
  expect(PrimitiveType.object.match([])).toBe(false)
  expect(PrimitiveType.object.match(funA)).toBe(false)
  expect(PrimitiveType.object.match(ClassA)).toBe(false)
  expect(PrimitiveType.object.match(instanceA)).toBe(false)

})

test('PrimitiveType.function.match', () => {

  expect(PrimitiveType.function.match(funA)).toBe(true)

  expect(PrimitiveType.function.match('')).toBe(false)
  expect(PrimitiveType.function.match('123')).toBe(false)
  expect(PrimitiveType.function.match('abc')).toBe(false)
  expect(PrimitiveType.function.match(objectString)).toBe(false)
  expect(PrimitiveType.function.match(123)).toBe(false)
  expect(PrimitiveType.function.match(0)).toBe(false)
  expect(PrimitiveType.function.match(-123)).toBe(false)
  expect(PrimitiveType.function.match(symbolA)).toBe(false)
  expect(PrimitiveType.function.match(true)).toBe(false)
  expect(PrimitiveType.function.match(false)).toBe(false)
  expect(PrimitiveType.function.match(undefined)).toBe(false)
  expect(PrimitiveType.function.match(null)).toBe(false)
  expect(PrimitiveType.function.match({})).toBe(false)
  expect(PrimitiveType.function.match([])).toBe(false)
  expect(PrimitiveType.function.match(ClassA)).toBe(false)
  expect(PrimitiveType.function.match(instanceA)).toBe(false)

})

test('PrimitiveType.from', () => {
  expect(PrimitiveType.from('')).toBe(PrimitiveType.string)
  expect(PrimitiveType.from(123)).toBe(PrimitiveType.number)
  expect(PrimitiveType.from(0)).toBe(PrimitiveType.number)
  expect(PrimitiveType.from(-123)).toBe(PrimitiveType.number)
  expect(PrimitiveType.from({})).toBe(PrimitiveType.object)
  expect(PrimitiveType.from({ a: 100 })).toBe(PrimitiveType.object)
  expect(PrimitiveType.from(symbolA)).toBe(PrimitiveType.symbol)
  expect(PrimitiveType.from(undefined)).toBe(PrimitiveType.undefined)
  expect(PrimitiveType.from(false)).toBe(PrimitiveType.boolean)
  expect(PrimitiveType.from(true)).toBe(PrimitiveType.boolean)
  expect(PrimitiveType.from(funA)).toBe(PrimitiveType.function)

  expect(PrimitiveType.from(objectString)).toBe(undefined)
  expect(PrimitiveType.from(null)).toBe(undefined)
  expect(PrimitiveType.from([])).toBe(undefined)
  expect(PrimitiveType.from(ClassA)).toBe(undefined)
  expect(PrimitiveType.from(instanceA)).toBe(undefined)

})

test('PrimitiveType.isPrimitive', () => {
  expect(PrimitiveType.isPrimitive('')).toBe(true)
  expect(PrimitiveType.isPrimitive(123)).toBe(true)
  expect(PrimitiveType.isPrimitive(0)).toBe(true)
  expect(PrimitiveType.isPrimitive(-123)).toBe(true)
  expect(PrimitiveType.isPrimitive({})).toBe(true)
  expect(PrimitiveType.isPrimitive({ a: 100 })).toBe(true)
  expect(PrimitiveType.isPrimitive(symbolA)).toBe(true)
  expect(PrimitiveType.isPrimitive(undefined)).toBe(true)
  expect(PrimitiveType.isPrimitive(false)).toBe(true)
  expect(PrimitiveType.isPrimitive(true)).toBe(true)
  expect(PrimitiveType.isPrimitive({})).toBe(true)
  expect(PrimitiveType.isPrimitive(funA)).toBe(true)

  expect(PrimitiveType.isPrimitive(objectString)).toBe(false)
  expect(PrimitiveType.isPrimitive(null)).toBe(false)
  expect(PrimitiveType.isPrimitive([])).toBe(false)
  expect(PrimitiveType.isPrimitive(ClassA)).toBe(false)
  expect(PrimitiveType.isPrimitive(instanceA)).toBe(false)

})

test('PrimitiveType.name', () => {
  expect(PrimitiveType.string.name).toBe('string')
  expect(PrimitiveType.number.name).toBe('number')
  expect(PrimitiveType.bigint.name).toBe('bigint')
  expect(PrimitiveType.symbol.name).toBe('symbol')
  expect(PrimitiveType.boolean.name).toBe('boolean')
  expect(PrimitiveType.object.name).toBe('object')
  expect(PrimitiveType.function.name).toBe('function')
  expect(PrimitiveType.undefined.name).toBe('undefined')
})
