import { PropertySource } from './PropertySource'

export abstract class EnumerablePropertySource<T> extends PropertySource<T> {
	abstract getPropertyNames(): string[]
}
