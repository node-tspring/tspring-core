import { MultiValueMap } from './MultiValueMap'
import { CollectionUtils } from './CollectionUtils'
import { Class } from '../lang/type/Class'
import { Implements } from '../lang/type/Interface'

@Implements(MultiValueMap)
export class ArrayMultiValueMap<K, V> implements MultiValueMap<K, V> {
	[Symbol.toStringTag]: string

	private targetMap: Map<K, V[]>

	constructor ()
  constructor(otherMap?: Map<K, V[]>)

	constructor(otherMap?: Map<K, V[]>) {
    if (otherMap) {
      this.targetMap = new Map<K, V[]>(otherMap)
    } else {
      this.targetMap = new Map<K, V[]>()
    }
	}

	// MultiValueMap implementation

	getFirst(key: K): V | undefined {
		const values = this.targetMap.get(key)
		return values != undefined && values.length > 0 ? values[0] : undefined
	}

	add(key: K, value: V | undefined ) {
    const values = CollectionUtils.computeIfAbsent(this.targetMap, key, () => [])
		values.push(value!)
	}

  addAll(values: MultiValueMap<K, V>): void
  addAll(key: K, values: V[]): void

	addAll(arg1: any, values?: V[]) {
    if (Class.isImplements<MultiValueMap<K, V>>(arg1, MultiValueMap)) {
      arg1.forEach((value, key) => {
        this.addAll(key, value)
      })
    } else if (values != undefined) {
      const currentValues = CollectionUtils.computeIfAbsent(this.targetMap, arg1, () => [])
      CollectionUtils.addAll(currentValues, values)
    }
  }

	set(key: K, value: any): this {
		const values = [value!]
		this.targetMap.set(key, values)
		return this
	}

	setAll(values: Map<K, V>) {
	 	values.forEach((value, key) => {
      this.set(key, value)
    })
	}

	// @Override
	// Map<K, V> toSingleValueMap() {
	// 	LinkedHashMap<K, V> singleValueMap = new LinkedHashMap<>(this.targetMap.size())
	// 	this.targetMap.forEach((key, values) -> {
	// 		if (values != undefined && !values.isEmpty()) {
	// 			singleValueMap.put(key, values.get(0))
	// 		}
	// 	})
	// 	return singleValueMap
	// }

	// // Map implementation

	forEach(callbackfn: (value: V[], key: K, map: Map<K, V[]>) => void, thisArg?: any): void {
		this.targetMap.forEach((value, key, map) => {
      callbackfn(value, key, map)
    }, thisArg)
	}

	has(key: K): boolean {
		return this.targetMap.has(key)
	}

	[Symbol.iterator](): IterableIterator<[K, V[]]> {
		return this.targetMap[Symbol.iterator]()
	}

	entries(): IterableIterator<[K, V[]]> {
		return this.targetMap.entries()
	}

	values(): IterableIterator<V[]> {
		return this.targetMap.values()
	}

	get size() {
		return this.targetMap.size
	}

	delete(key: K): boolean {
		return this.targetMap.delete(key)
	}

	hasValue(value: V) {
		for(const v of this.targetMap.values()){
      if (v.indexOf(value) > -1) {
        return true
      }
    }
    return false
	}

	get(key: K, defaultValue?: V[]): V[] | undefined {
		const val = this.targetMap.get(key)
		return val == undefined ? defaultValue : val
	}

	put(key: K, value: V[]) {
		this.targetMap.set(key, value)
	}

	putAll(map: Map<K, V[]> ) {
    map.forEach((value, key) => {
      this.put(key, value)
    })
	}

	clear() {
		this.targetMap.clear()
	}

	keys() {
		return this.targetMap.keys()
	}

	// /**
	//  * Create a deep copy of this Map.
	//  * @return a copy of this Map, including a copy of each value-holding List entry
	//  * (consistently using an independent modifiable {@link LinkedList} for each entry)
	//  * along the lines of {@code MultiValueMap.addAll} semantics
	//  * @since 4.2
	//  * @see #addAll(MultiValueMap)
	//  * @see #clone()
	//  */
	// LinkedMultiValueMap<K, V> deepCopy() {
	// 	LinkedMultiValueMap<K, V> copy = new LinkedMultiValueMap<>(this.targetMap.size())
	// 	this.targetMap.forEach((key, value) -> copy.put(key, new LinkedList<>(value)))
	// 	return copy
	// }

	// /**
	//  * Create a regular copy of this Map.
	//  * @return a shallow copy of this Map, reusing this Map's value-holding List entries
	//  * (even if some entries are shared or unmodifiable) along the lines of standard
	//  * {@code Map.put} semantics
	//  * @since 4.2
	//  * @see #put(Object, List)
	//  * @see #putAll(Map)
	//  * @see LinkedMultiValueMap#LinkedMultiValueMap(Map)
	//  * @see #deepCopy()
	//  */
	// @Override
	// LinkedMultiValueMap<K, V> clone() {
	// 	return new LinkedMultiValueMap<>(this)
	// }

}
