import { PropertySource } from './PropertySource'
import { Interface } from '../../lang/type/Interface'

export interface PropertySources extends Iterable<PropertySource<Object>> {
	contains(name: string): boolean
	get(name: string): PropertySource<Object> | undefined
}

export const PropertySources = new Interface('PropertySources')
