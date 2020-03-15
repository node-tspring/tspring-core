import { AbstractPropertyResolver } from './AbstractPropertyResolver'
import { PropertySources } from './PropertySources'
import { PropertySource } from './PropertySource'
import { PrimitiveType } from '../../lang/type/PrimitiveType'
import { TypeDef } from '../../lang/type/TypeDef'

export class PropertySourcesPropertyResolver extends AbstractPropertyResolver {

  private propertySources: PropertySources

  constructor(propertySources: PropertySources) {
    super()
		this.propertySources = propertySources
  }

	getProperty(key: string): string
	getProperty(key: string, defaultValue: string): string
	getProperty<T>(key: string, targetType: TypeDef): T
	getProperty<T>(key: string, targetType: TypeDef, defaultValue: T): T

  getProperty<T>(key: string, arg2?: string | TypeDef, defaultValue?: T): T | undefined {
		let targetType: TypeDef | undefined
    if (typeof arg2 == 'string') {
      defaultValue = arg2 as any
    } else if (arg2 != undefined) {
      targetType = arg2
    }

    const value = this.$getProperty<T>(key, targetType, true)
		return value != undefined ? value : defaultValue
	}

  protected getPropertyAsRawString(key: string): string | undefined {
		return this.$getProperty(key, PrimitiveType.string, false) as string
  }

  protected $getProperty<T>(key: string, targetValueType: TypeDef | undefined, resolveNestedPlaceholders: boolean): T | undefined {
		if (this.propertySources != undefined) {
			for (const propertySource of this.propertySources) {
				console.debug(`Searching for key '${key}' in PropertySource '${propertySource.getName()}'`)
				let value = propertySource.getProperty(key)
				if (value != undefined) {
					if (resolveNestedPlaceholders && typeof value == 'string') {
						value = this.resolveNestedPlaceholders(value)
					}
					this.logKeyFound(key, propertySource, value)
					return this.convertValueIfNecessary(value, targetValueType)
				}
			}
		}
		console.debug(`Could not find key '${key}' in any property source`)
		return undefined
  }

  protected logKeyFound(key: string, propertySource: PropertySource<Object>, value: Object) {
    console.debug(`Found key '${key}' in PropertySource '${propertySource.getName()}' with value of type ${value && value.constructor && value.constructor.name}`)
	}
}
