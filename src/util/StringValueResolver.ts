import { Interface } from '../lang/type/Interface'

export interface StringValueResolver {
	resolveStringValue(strVal: string): string | undefined
	resolveObjectValue(key: string): any
}

export const StringValueResolver = new Interface('StringValueResolver')
