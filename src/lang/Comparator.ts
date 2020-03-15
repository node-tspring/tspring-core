import { Interface } from './type/Interface'

export interface Comparator<T> {
  compare(o1: T, o2: T): number
}

export const Comparator = new Interface('Comparator')
