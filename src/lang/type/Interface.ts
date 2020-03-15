export class Interface {
	readonly name: string
	readonly SYMBOL: symbol
	readonly EXTENDS?: Interface[]

	constructor (name: string, parents?: Interface[]) {
		this.name = name
		this.SYMBOL = Symbol(name)
		this.EXTENDS = parents
  }

  static isExtends (child: Interface | undefined, parent: Interface | undefined) {
    return Interface.isParentInterfaceOf(parent, child)
  }

  static isParentInterfaceOf (parent: Interface | undefined, child: Interface | undefined) {
    if (parent == undefined || child == undefined) return false
    const parents = child.EXTENDS
    if (parents) {
      for (const item of parents) {
        if (item == parent) return true
        if (Interface.isParentInterfaceOf(item, child)) {
          return true
        }
      }
    }
    return false
  }
}

function applyInterfaceSymbol (iface: Interface, target: any) {
  Reflect.defineMetadata(iface.SYMBOL, undefined, target)
  if (iface.EXTENDS) {
    iface.EXTENDS.forEach((item) => {
      applyInterfaceSymbol(item, target)
    })
  }
}

export function Implements(...interfaces: Interface[]) {
  return (Clazz: any) => {
    for (const iface of interfaces) {
      applyInterfaceSymbol(iface, Clazz.prototype)
    }
  }
}
