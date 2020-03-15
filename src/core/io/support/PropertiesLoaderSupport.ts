import { Properties } from '../../../lang/Properties'

export abstract class PropertiesLoaderSupport {
	protected localOverride = false

	protected mergeProperties(): Properties {
    const result = new Properties()
    return result
  }
}
