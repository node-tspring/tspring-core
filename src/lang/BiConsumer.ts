import { Interface } from './type/Interface'

export interface BiConsumer<T, U> {
  accept(t: T, u: U): void
}

export const BiConsumer = new Interface('BiConsumer')
