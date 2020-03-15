function define<T>(name: string): PrimitiveType {
  return new (class extends PrimitiveType {
    readonly name = name
    match(obj: any): obj is T {
      return typeof obj == name
    }
  })
}

const RegexClassTester = /^class\s/

export abstract class PrimitiveType {
  abstract readonly name: string
  abstract match (obj: any): boolean

  static bigint = define<bigint>('bigint')
  static boolean = define<boolean>('boolean')
  static number = define<number>('number')
  static string = define<string>('string')
  static symbol = define<symbol>('symbol')
  static undefined = define<undefined>('undefined')
  static object = new (class extends PrimitiveType {
    readonly name = 'object'
    match(obj: any): obj is object {
      return obj != null && !Array.isArray(obj) && typeof obj == 'object' && obj.constructor == Object
    }
  })

  static function = new (class extends PrimitiveType {
    readonly name = 'function'
    match<T extends Function>(obj: any): obj is T {
      return typeof obj == 'function' && !RegexClassTester.test(Function.prototype.toString.call(obj))
    }
  })

  static isPrimitive(obj: any): boolean {
    return PrimitiveType.from(obj) != undefined
  }

  static from(obj: any): PrimitiveType | undefined {
    if (obj === null || Array.isArray(obj)) {
      return undefined
    }

    else if (typeof obj == 'function') {
      return PrimitiveType.function.match(obj) ? PrimitiveType.function : undefined
    }

    else if (typeof obj == 'object') {
      return PrimitiveType.object.match(obj) ? PrimitiveType.object : undefined
    }

    else {
      return (PrimitiveType as any)[typeof obj]
    }
  }
}
