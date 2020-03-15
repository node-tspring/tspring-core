import { ConfigurableEnvironment } from './ConfigurableEnvironment'
import { MutablePropertySources } from './MutablePropertySources'
import { StringUtils } from '../../util/StringUtils'
import { IllegalArgumentException } from '../../lang/exception/IllegalArgumentException'
import { PropertySourcesPropertyResolver } from './PropertySourcesPropertyResolver'
import { Implements } from '../../lang/type/Interface'
import { ConfigurableConversionService } from '../convert/support/ConfigurableConversionService'
import { TypeDef } from '../../lang/type/TypeDef'

const SYSTEM_PROPERTIES_PERFIX = 'nodejs'
const ACTIVE_PROFILES_PROPERTY_NAME = 'spring.profiles.active'

@Implements(ConfigurableEnvironment)
export abstract class AbstractEnvironment implements ConfigurableEnvironment {

  static readonly ACTIVE_PROFILES_PROPERTY_NAME = ACTIVE_PROFILES_PROPERTY_NAME

	private propertySources = new MutablePropertySources()
  private propertyResolver = new PropertySourcesPropertyResolver(this.propertySources)
	private activeProfiles = new Set<string>()
	private defaultProfiles = new Set<string>()

  constructor() {
		this.customizePropertySources(this.propertySources)
  }

  getConversionService(): ConfigurableConversionService {
		return this.propertyResolver.getConversionService()
  }

  setConversionService(conversionService: ConfigurableConversionService): void {
		this.propertyResolver.setConversionService(conversionService)
  }

  setPlaceholderPrefix(placeholderPrefix: string): void {
		this.propertyResolver.setPlaceholderPrefix(placeholderPrefix)
  }

  setPlaceholderSuffix(placeholderSuffix: string): void {
		this.propertyResolver.setPlaceholderSuffix(placeholderSuffix)
  }

  setValueSeparator(valueSeparator: string | undefined): void {
		this.propertyResolver.setValueSeparator(valueSeparator)
  }

  getActiveProfiles(): string[] {
		return Array.from(this.doGetActiveProfiles())
  }

  protected doGetActiveProfiles(): Set<string> {
    if (this.activeProfiles.size == 0) {
      const profiles = this.getProperty(ACTIVE_PROFILES_PROPERTY_NAME)
      if (StringUtils.hasText(profiles)) {
        this.setActiveProfiles(...profiles.trim().split(/\s*,\s*/))
      }
		}
    return this.activeProfiles
  }

  setActiveProfiles(...profiles: string[]) {
    console.debug(`Activating profiles ${profiles}`)
    this.activeProfiles.clear()
    for (const profile of profiles) {
      this.validateProfile(profile)
      this.activeProfiles.add(profile)
    }
  }

  protected validateProfile(profile: string) {
		if (!StringUtils.hasText(profile)) {
			throw new IllegalArgumentException(`Invalid profile [${profile}]: must contain text`)
		}
		if (profile.charAt(0) == '!') {
			throw new IllegalArgumentException(`Invalid profile [${profile}]: must not begin with ! operator`)
		}
	}

  protected customizePropertySources(propertySources: MutablePropertySources) {

  }

  getSystemProperties(): Map<string, Object> {
    const result = new Map<string, Object>()
    result.set(`${SYSTEM_PROPERTIES_PERFIX}.version`, process.version)
    result.set(`${SYSTEM_PROPERTIES_PERFIX}.execPath`, process.execPath)
    Object.keys(process.config.target_defaults).forEach(key => {
      result.set(`${SYSTEM_PROPERTIES_PERFIX}.target_defaults.${key}`, (process.config.target_defaults as any)[key]!)
    })
    Object.keys(process.config.variables).forEach((key) => {
      result.set(`${SYSTEM_PROPERTIES_PERFIX}.variables.${key}`, (process.config.variables as any)[key]!)
    })

    return result
  }

  getSystemEnvironment(): Map<string, Object> {
    const result = new Map<string, Object>()
    Object.keys(process.env).forEach(key => {
      result.set(key, process.env[key]!)
    })

    return result
	}

  getProperty(key: string): string
  getProperty(key: string, defaultValue: string): string
  getProperty<T>(key: string, targetType: TypeDef): T
  getProperty<T>(key: string, targetType: TypeDef, defaultValue: T): T

  getProperty<T>(key: string, arg2?: string | TypeDef, defaultValue?: T): T | string {
    return this.propertyResolver.getProperty<T>(key, arg2 as any, defaultValue as any)
  }

  resolvePlaceholders(text: string): string {
		return this.propertyResolver.resolvePlaceholders(text)
  }

  resolveRequiredPlaceholders(text: string): string {
		return this.propertyResolver.resolveRequiredPlaceholders(text)
  }

  addActiveProfile(profile: string): void {
    console.debug(`Activating profile '${profile}'`)
		this.validateProfile(profile)
		this.doGetActiveProfiles()
		this.activeProfiles.add(profile)
  }

  setDefaultProfiles(...profiles: string[]): void {
    this.defaultProfiles.clear()
    for (const profile of profiles) {
      this.validateProfile(profile)
      this.defaultProfiles.add(profile)
    }
  }

  getPropertySources(): MutablePropertySources {
    return this.propertySources
  }

  merge(parent: ConfigurableEnvironment): void {
    throw new Error('Method not implemented.')
  }

  getDefaultProfiles(): string[] {
    return Array.from(this.doGetDefaultProfiles())
  }

  protected doGetDefaultProfiles(): Set<string> {
    // if (this.defaultProfiles.equals(getReservedDefaultProfiles())) {
    //   string profiles = getProperty(DEFAULT_PROFILES_PROPERTY_NAME)
    //   if (StringUtils.hasText(profiles)) {
    //     setDefaultProfiles(StringUtils.commaDelimitedListToStringArray(
    //         StringUtils.trimAllWhitespace(profiles)))
    //   }
    // }
    return this.defaultProfiles
	}

  containsProperty(key: string): boolean {
		return this.propertyResolver.containsProperty(key)
  }
}
