import { Interface } from './type/Interface'

export interface Consumer<T> {
  accept(t: T | undefined): void
}

export const Consumer = new Interface('Consumer')
