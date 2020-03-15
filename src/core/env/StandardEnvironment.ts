import { AbstractEnvironment } from './AbstractEnvironment'
import { PropertiesPropertySource } from './PropertiesPropertySource'
import { MutablePropertySources } from './MutablePropertySources'
import { SystemEnvironmentPropertySource } from './SystemEnvironmentPropertySource'

const SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME = 'systemEnvironment'
const SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME = 'systemProperties'

export class StandardEnvironment extends AbstractEnvironment {
  static readonly SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME = SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME
  static readonly SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME = SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME


  protected customizePropertySources(propertySources: MutablePropertySources) {
		propertySources.addLast(
				new PropertiesPropertySource(SYSTEM_PROPERTIES_PROPERTY_SOURCE_NAME, this.getSystemProperties()))
		propertySources.addLast(
				new SystemEnvironmentPropertySource(SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME, this.getSystemEnvironment()))
	}
}
