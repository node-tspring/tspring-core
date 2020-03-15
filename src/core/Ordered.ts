import { Interface } from '../lang/type/Interface'

export interface Ordered {
	getOrder(): number
}

export const Ordered = new (class extends Interface {
	readonly HIGHEST_PRECEDENCE = Number.MIN_SAFE_INTEGER
	readonly LOWEST_PRECEDENCE = Number.MAX_SAFE_INTEGER
})('Ordered')
