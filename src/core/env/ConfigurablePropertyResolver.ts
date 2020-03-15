import { PropertyResolver } from './PropertyResolver'
import { Interface } from '../../lang/type/Interface'
import { ConfigurableConversionService } from '../convert/support/ConfigurableConversionService'

export interface ConfigurablePropertyResolver extends PropertyResolver {
	getConversionService(): ConfigurableConversionService
	setConversionService(conversionService: ConfigurableConversionService): void

  setPlaceholderPrefix(placeholderPrefix: string): void
	setPlaceholderSuffix(placeholderSuffix: string): void
	setValueSeparator(valueSeparator: string | undefined): void
	// setIgnoreUnresolvableNestedPlaceholders(ignoreUnresolvableNestedPlaceholders: boolean): void

  // setRequiredProperties(...requiredProperties: string[]): void
	// validateRequiredProperties(): void

}

export const ConfigurablePropertyResolver = new Interface('ConfigurablePropertyResolver', [PropertyResolver])
