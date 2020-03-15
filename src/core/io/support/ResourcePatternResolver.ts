import { ResourceLoader } from '../ResourceLoader'
import { Resource } from '../Resource'
import { Interface } from '../../../lang/type/Interface'

export interface ResourcePatternResolver extends ResourceLoader {
	getResources(locationPattern: string): Resource[]
}

export const ResourcePatternResolver = new Interface('ResourcePatternResolver', [ResourceLoader])
