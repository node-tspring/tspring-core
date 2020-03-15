import { Interface } from '../../lang/type/Interface'
import { TypeDef } from '../../lang/type/TypeDef'

export interface PropertyResolver {
	getProperty(key: string): string
	getProperty(key: string, defaultValue: string): string
	getProperty<T>(key: string, targetType: TypeDef): T
  getProperty<T>(key: string, targetType: TypeDef, defaultValue: T): T
	containsProperty(key: string): boolean

	resolvePlaceholders(text: string): string
	resolveRequiredPlaceholders(text: string): string

}

export const PropertyResolver = new Interface('PropertyResolver')
