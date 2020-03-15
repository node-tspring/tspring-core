import { ConfigurablePropertyResolver } from './ConfigurablePropertyResolver'
import { SystemPropertyUtils } from '../../util/SystemPropertyUtils'
import { PropertyPlaceholderHelper } from '../../util/PropertyPlaceholderHelper'
import { Implements } from '../../lang/type/Interface'
import { ConfigurableConversionService } from '../convert/support/ConfigurableConversionService'
import { GenericType } from '../../lang/type/GenericType'
import { DefaultConversionService } from '../convert/support/DefaultConversionService'
import { ConversionService } from '../convert/ConversionService'
import { TypeDef } from '../../lang/type/TypeDef'
import { PrimitiveType } from '../../lang/type/PrimitiveType'

@Implements(ConfigurablePropertyResolver)
export abstract class AbstractPropertyResolver implements ConfigurablePropertyResolver {
  protected abstract getPropertyAsRawString(key: string): string | undefined
  private strictHelper?: PropertyPlaceholderHelper

  private placeholderPrefix = SystemPropertyUtils.PLACEHOLDER_PREFIX
	private placeholderSuffix = SystemPropertyUtils.PLACEHOLDER_SUFFIX
  private valueSeparator: string | undefined = SystemPropertyUtils.VALUE_SEPARATOR
	private ignoreUnresolvableNestedPlaceholders = false
	private nonStrictHelper?: PropertyPlaceholderHelper
	private conversionService?: ConfigurableConversionService

  getConversionService(): ConfigurableConversionService {
    let cs = this.conversionService
		if (cs == undefined) {
      cs = new DefaultConversionService()
      this.conversionService = cs
		}
		return cs
  }

  setConversionService(conversionService: ConfigurableConversionService): void {
		this.conversionService = conversionService
  }

  setPlaceholderPrefix(placeholderPrefix: string): void {
    this.placeholderPrefix = placeholderPrefix
  }

  setPlaceholderSuffix(placeholderSuffix: string): void {
    this.placeholderSuffix = placeholderSuffix
  }

  setValueSeparator(valueSeparator: string | undefined): void {
    this.valueSeparator = valueSeparator
  }

  getProperty(key: string): string
  getProperty(key: string, defaultValue: string): string
  getProperty<T>(key: string, targetType: TypeDef): T
  getProperty<T>(key: string, targetType: TypeDef, defaultValue: T): T

  getProperty<T>(key: string, arg2?: string | TypeDef, defaultValue?: T): T | undefined {
    let targetType: TypeDef = PrimitiveType.string
    if (typeof arg2 == 'string') {
      defaultValue = arg2 as any
    } else if (arg2 != undefined) {
      targetType = arg2
    }

    const value = this.getProperty<T>(key, targetType)
    return value != undefined ? value : defaultValue
  }

  resolvePlaceholders(text: string): string {
    if (this.nonStrictHelper == undefined) {
			this.nonStrictHelper = this.createPlaceholderHelper(true)
		}
		return this.doResolvePlaceholders(text, this.nonStrictHelper)
  }

  resolveRequiredPlaceholders(text: string): string {
    if (this.strictHelper == undefined) {
			this.strictHelper = this.createPlaceholderHelper(false)
		}
		return this.doResolvePlaceholders(text, this.strictHelper)
  }

  private createPlaceholderHelper(ignoreUnresolvablePlaceholders: boolean) {
		return new PropertyPlaceholderHelper(
      this.placeholderPrefix,
      this.placeholderSuffix,
      this.valueSeparator,
      ignoreUnresolvablePlaceholders
    )
	}

  private doResolvePlaceholders(text: string, helper: PropertyPlaceholderHelper) {
		return helper.replacePlaceholders(text, {
      resolvePlaceholder: (key: string) => {
        return this.getPropertyAsRawString(key)
      }
    })
  }

  setIgnoreUnresolvableNestedPlaceholders(ignoreUnresolvableNestedPlaceholders: boolean) {
		this.ignoreUnresolvableNestedPlaceholders = ignoreUnresolvableNestedPlaceholders
	}

  protected resolveNestedPlaceholders(value: string) {
    return this.ignoreUnresolvableNestedPlaceholders
      ? this.resolvePlaceholders(value)
      : this.resolveRequiredPlaceholders(value)
  }

  containsProperty(key: string): boolean {
		return this.getProperty(key) != undefined
  }

  protected convertValueIfNecessary<T>(value: Object, targetType: TypeDef | undefined): T | undefined {
		if (targetType == undefined) {
			return value as T
		}
		let conversionServiceToUse: ConversionService | undefined = this.conversionService
		if (conversionServiceToUse == undefined) {
			// Avoid initialization of shared DefaultConversionService if
			// no standard type conversion is needed in the first place...
			if (GenericType.isMatch(value, targetType)) {
				return value as T
			}
			conversionServiceToUse = DefaultConversionService.getSharedInstance()
		}
		return conversionServiceToUse.convert(value, targetType)
	}
}
