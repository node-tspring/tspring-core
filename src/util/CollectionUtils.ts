export abstract class CollectionUtils {

  static emptySet<T>() {
    return new Set<T>()
  }

  static singleton<T>(o: T) {
    return new Set<T>([o])
  }

  static lastElement<T>(array: T[] | undefined): T | undefined
  static lastElement<T>(elements: Iterable<T> | undefined): T | undefined

  static lastElement<T>(arg1: Iterable<T> | undefined) {
		if (CollectionUtils.isEmpty(arg1)) {
			return undefined
    }

    if (Array.isArray(arg1)) {
      return arg1[arg1.length - 1]
    }

    else {
      // Full iteration necessary...
      const it = arg1![Symbol.iterator]()
      let last: IteratorResult<T>
      while (last = it.next()) {
        if (last.done) {
          return last.value
        }
      }
      return undefined
    }
  }

  static isEqual(c1: any, c2: any) {
    if (c1 == c2) return true

    if (typeof c1 == typeof c2) {
      if (Array.isArray(c1)) {
        if (c1.length == c2.length) {
          let result = true
          c1.forEach((val, index) => {
            result = result && val == c2[index]
          })
          return result
        }
      }

      else if (c1 instanceof Set) {
        if (c1.size == c2.size) {
          let result = true
          c1.forEach((val) => {
            result = result && c2.has(val)
          })
          return result
        }
      }
    }

    return false
  }

  static addAll <T>(c: T[], elements: Iterable<T>): void
  static addAll <T>(c: T[], ...elements: Iterable<T>[]): void
  static addAll <T>(c: Set<T>, elements: Iterable<T>): void
  static addAll <T>(c: Set<T>, ...elements: Iterable<T>[]): void

  static addAll <T>(c: Set<T> | T[], ...arg2: Iterable<T>[]) {
    if (c instanceof Set) {
      for (const elements of arg2) {
        for (const item of elements) {
          c.add(item)
        }
      }
    }

    else {
      for (const elements of arg2) {
        for (const item of elements) {
          c.push(item)
        }
      }
    }
  }

  static isEmpty<T>(iterable: Iterable<T> | undefined) {
    return iterable == undefined ? true : iterable[Symbol.iterator]().next().done!
  }

  static computeIfAbsent<K, V>(map: Map<K,V>, key: K, mappingFunction: (key: K) => V) {
    let value = map.get(key)
    if (value == undefined) {
      value = mappingFunction(key)
      map.set(key, value)
    }
    return value
  }

  static toArray<T>(obj: T | T[] | undefined, defaultValue?: T | T[]): T[] {
    if (obj == undefined) return CollectionUtils.toArray(defaultValue, [])
    if (Array.isArray(obj)) {
      if (obj.length == 0) return CollectionUtils.toArray(defaultValue, [])
      return obj
    }
    return [obj]
  }
}
