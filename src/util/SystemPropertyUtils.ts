import { PropertyPlaceholderHelper } from './PropertyPlaceholderHelper'
import { Implements } from '../lang/type/Interface'

const PLACEHOLDER_PREFIX = '${'
const PLACEHOLDER_SUFFIX = '}'
const VALUE_SEPARATOR = ':'

@Implements(PropertyPlaceholderHelper.PlaceholderResolver)
class SystemPropertyPlaceholderResolver implements PropertyPlaceholderHelper.PlaceholderResolver {

  constructor(private text: string) {
    this.text = text
  }

  resolvePlaceholder(placeholderName: string): string | undefined {
    try {
      let propVal = `System.getProperty(${placeholderName})`
      if (propVal == undefined) {
        // Fall back to searching the system environment.
        propVal = `System.getenv(${placeholderName})`
      }
      return propVal
    } catch (ex) {
      console.error(`Could not resolve placeholder '${placeholderName}' in [${this.text}] as system property: `, ex)
      return undefined
    }
  }
}

export abstract class SystemPropertyUtils {

	/** Prefix for system property placeholders: '${'. */
	static readonly PLACEHOLDER_PREFIX = PLACEHOLDER_PREFIX

	/** Suffix for system property placeholders: '}'. */
	static readonly PLACEHOLDER_SUFFIX = PLACEHOLDER_SUFFIX

	/** Value separator for system property placeholders: ':'. */
	static readonly VALUE_SEPARATOR = VALUE_SEPARATOR


	private static strictHelper =	new PropertyPlaceholderHelper(PLACEHOLDER_PREFIX, PLACEHOLDER_SUFFIX, VALUE_SEPARATOR, false)

	private static nonStrictHelper = new PropertyPlaceholderHelper(PLACEHOLDER_PREFIX, PLACEHOLDER_SUFFIX, VALUE_SEPARATOR, true)


	static resolvePlaceholders(text: string, ignoreUnresolvablePlaceholders = false) {
		const helper = ignoreUnresolvablePlaceholders ? this.nonStrictHelper : this.strictHelper
		return helper.replacePlaceholders(text, new SystemPropertyPlaceholderResolver(text))
	}
}
