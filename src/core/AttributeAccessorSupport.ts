import { AttributeAccessor } from './AttributeAccessor'
import { Implements } from '../lang/type/Interface'

@Implements(AttributeAccessor)
export abstract class AttributeAccessorSupport implements AttributeAccessor {

  private attributes = {} as { [key: string]: any }

  setAttribute(name: string, value: any): void {
    if (value != undefined) {
      this.attributes[name] = value
    } else {
      this.removeAttribute(name)
    }
  }

  getAttribute(name: string) {
    return this.attributes[name]
  }

  removeAttribute(name: string): any {
    const value = this.attributes[name]
    delete this.attributes[name]
    return value
  }

  hasAttribute(name: string): boolean {
    return !!this.attributes[name]
  }

  attributeNames(): string[] {
    return Object.keys(this.attributes)
  }


  copyAttributesFrom(source: AttributeAccessor): void {
    const attributeNames = source.attributeNames()
    for (const attributeName of attributeNames) {
      this.setAttribute(attributeName, source.getAttribute(attributeName))
    }
  }

  equals(other: any): boolean {
    if (this == other) {
      return true
    } else if (other instanceof AttributeAccessorSupport) {
      const attributeNames = other.attributeNames()
      if (attributeNames.length === this.attributeNames().length) {
        for (const attributeName of attributeNames) {
          if (this.attributes[attributeName] !== other.getAttribute(attributeName)) {
            return false
          }
        }
        return true
      }
    }
    return false
  }

  // hashCode(): int {
  //   return this.attributes.hashCode()
  // }
}

