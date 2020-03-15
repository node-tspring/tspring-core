import { Properties } from '../lang/Properties'
import { IllegalArgumentException } from '../lang/exception/IllegalArgumentException'
import { StringUtils } from './StringUtils'
import { Interface } from '../lang/type/Interface'

const wellKnownSimplePrefixes = new Map<string, string>()
type PlaceholderResolver = PropertyPlaceholderHelper.PlaceholderResolver

export class PropertyPlaceholderHelper {
  private placeholderPrefix: string
  private placeholderSuffix: string
  private simplePrefix: string
  private valueSeparator: string | undefined
  private ignoreUnresolvablePlaceholders: boolean

  constructor(
    placeholderPrefix: string,
    placeholderSuffix: string,
    valueSeparator: string | undefined,
    ignoreUnresolvablePlaceholders: boolean = true
  ) {

    this.placeholderPrefix = placeholderPrefix
    this.placeholderSuffix = placeholderSuffix
    const simplePrefixForSuffix = wellKnownSimplePrefixes.get(this.placeholderSuffix)
    if (simplePrefixForSuffix != undefined && this.placeholderPrefix.endsWith(simplePrefixForSuffix)) {
      this.simplePrefix = simplePrefixForSuffix
    }
    else {
      this.simplePrefix = this.placeholderPrefix
    }
    this.valueSeparator = valueSeparator
    this.ignoreUnresolvablePlaceholders = ignoreUnresolvablePlaceholders
  }

  replacePlaceholders(value: string, properties: Properties): string
	replacePlaceholders(value: string, placeholderResolver: PlaceholderResolver): string

  replacePlaceholders(value: string, arg2: Properties | PlaceholderResolver) {
    const placeholderResolver = arg2 instanceof Properties ? { resolvePlaceholder: arg2.getProperty } : arg2
		return this.parseStringValue(value, placeholderResolver, undefined)
  }

  private findPlaceholderEndIndex(buf: string, startIndex: number) {
		let index = startIndex + this.placeholderPrefix.length
		let withinNestedPlaceholder = 0
		while (index < buf.length) {
			if (StringUtils.substringMatch(buf, index, this.placeholderSuffix)) {
				if (withinNestedPlaceholder > 0) {
					withinNestedPlaceholder--
					index = index + this.placeholderSuffix.length
				}
				else {
					return index
				}
			}
			else if (StringUtils.substringMatch(buf, index, this.simplePrefix)) {
				withinNestedPlaceholder++
				index = index + this.simplePrefix.length
			}
			else {
				index++
			}
		}
		return -1
	}

  protected parseStringValue(value: string, placeholderResolver: PlaceholderResolver, visitedPlaceholders?: Set<string>) {

    let startIndex = value.indexOf(this.placeholderPrefix)
    if (startIndex == -1) {
      return value
    }

    let result = value
    while (startIndex != -1) {
      let endIndex = this.findPlaceholderEndIndex(result, startIndex)
      if (endIndex != -1) {
        let placeholder = result.substring(startIndex + this.placeholderPrefix.length, endIndex)
        let originalPlaceholder = placeholder
        if (visitedPlaceholders == undefined) {
          visitedPlaceholders = new Set<string>()
        }
        if (visitedPlaceholders.has(originalPlaceholder)) {
          throw new IllegalArgumentException(`Circular placeholder reference '${originalPlaceholder}' in property definitions`)
        } else {
          visitedPlaceholders.add(originalPlaceholder)
        }

        // Recursive invocation, parsing placeholders contained in the placeholder key.
        placeholder = this.parseStringValue(placeholder, placeholderResolver, visitedPlaceholders)
        // Now obtain the value for the fully resolved key...
        let propVal: any = placeholderResolver.resolvePlaceholder(placeholder)
        if (propVal == undefined && this.valueSeparator != undefined) {
          const separatorIndex = placeholder.indexOf(this.valueSeparator)
          if (separatorIndex != -1) {
            const actualPlaceholder = placeholder.substring(0, separatorIndex)
            const defaultValue = placeholder.substring(separatorIndex + this.valueSeparator.length)
            propVal = placeholderResolver.resolvePlaceholder(actualPlaceholder)
            if (propVal == undefined) {
              propVal = defaultValue
            }
          }
        }
        if (propVal != undefined) {
          // Recursive invocation, parsing placeholders contained in the
          // previously resolved placeholder value.
          if (typeof propVal != 'string') { propVal = propVal.toString() }
          propVal = this.parseStringValue(propVal, placeholderResolver, visitedPlaceholders)
          result = result.substr(0, startIndex) + propVal + result.substr(endIndex + 1)
          console.debug(`Resolved placeholder '${placeholder}'`)
          startIndex = result.indexOf(this.placeholderPrefix, startIndex + propVal.length)
        }
        else if (this.ignoreUnresolvablePlaceholders) {
          // Proceed with unprocessed value.
          startIndex = result.indexOf(this.placeholderPrefix, endIndex + this.placeholderSuffix.length)
        }
        else {
          throw new IllegalArgumentException(`Could not resolve placeholder '${placeholder}' in value '${value}'`)
        }
        visitedPlaceholders.delete(originalPlaceholder)
      }
      else {
        startIndex = -1
      }
    }
    return result
  }

}

export module PropertyPlaceholderHelper {
  export interface PlaceholderResolver {
		resolvePlaceholder(placeholderName: string): string | undefined
  }

  export const PlaceholderResolver = new Interface('PlaceholderResolver')
}
