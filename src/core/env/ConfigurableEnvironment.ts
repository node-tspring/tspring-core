import { Environment } from './Environment'
import { ConfigurablePropertyResolver } from './ConfigurablePropertyResolver'
import { MutablePropertySources } from './MutablePropertySources'
import { Interface } from '../../lang/type/Interface'

export interface ConfigurableEnvironment extends Environment, ConfigurablePropertyResolver {
  setActiveProfiles(...profiles: string[]): void
	addActiveProfile(profile: string): void
  setDefaultProfiles(...profiles: string[]): void
	getPropertySources(): MutablePropertySources
	getSystemProperties(): Map<string, Object>
	getSystemEnvironment(): Map<string, Object>
	merge(parent: ConfigurableEnvironment): void
}

export const ConfigurableEnvironment = new Interface(
	'ConfigurableEnvironment',
	[Environment, ConfigurablePropertyResolver]
)
