import { ResourcePatternResolver } from './ResourcePatternResolver'
import { Resource } from '../Resource'
import { ResourceLoader } from '../ResourceLoader'
import { DefaultResourceLoader } from '../DefaultResourceLoader'
import { Implements } from '../../../lang/type/Interface'

@Implements(ResourcePatternResolver)
export class PathMatchingResourcePatternResolver implements ResourcePatternResolver {
	private resourceLoader: ResourceLoader

  constructor(resourceLoader?: ResourceLoader) {
    this.resourceLoader = resourceLoader != undefined
      ? resourceLoader
      : new DefaultResourceLoader()
  }

  getResourceLoader() {
		return this.resourceLoader
  }

  getResources(locationPattern: string): Resource[] {
    return []
  }

  getResource(location: string): Resource {
		return this.getResourceLoader().getResource(location)
  }
}
