import { Interface } from '../lang/type/Interface'

export interface MultiValueMap<K, V> extends Map<K, V[]>{
  getFirst(key: K): V | undefined
	add(key: K, value: V | undefined): void
  addAll(values: MultiValueMap<K, V>): void
  addAll(key: K, values: V[]): void
	setAll(values: Map<K, V>): void
  // toSingleValueMap(): Map<K, V>
}

export const MultiValueMap = new Interface('MultiValueMap')
