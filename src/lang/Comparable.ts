import { Interface } from './type/Interface'

export interface Comparable<T> {
  compareTo(o: T): number
}

export const Comparable = new Interface('Comparable')
