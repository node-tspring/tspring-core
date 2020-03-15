import { Interface } from './type/Interface'

export interface Supplier<T> {
  get(): T
}

export const Supplier = new Interface('Supplier', [])
