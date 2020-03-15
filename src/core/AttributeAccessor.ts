import { Interface } from '../lang/type/Interface'

export interface AttributeAccessor {
  setAttribute(name: string, value: any): void

  getAttribute(name: string): any

	removeAttribute(name: string): any

	hasAttribute(name: string): boolean

	attributeNames(): string[]
}

export const AttributeAccessor = new Interface('AttributeAccessor')
