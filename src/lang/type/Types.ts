export type BasicValueType = string | number | boolean

export function isBasicValueType(val: any): val is BasicValueType {
  return ['string', 'number', 'boolean'].indexOf(typeof val) > -1
}


export function Abstract (Clazz: any) {
  Reflect.defineMetadata(Abstract.SYMBOL, undefined, Clazz.prototype)
}

export module Abstract {
  export const SYMBOL = Symbol('Abstract')
}
