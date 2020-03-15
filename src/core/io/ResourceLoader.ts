import { Resource } from './Resource'
import { ResourceUtils } from '../../util/ResourceUtils'
import { Interface } from '../../lang/type/Interface'

export interface ResourceLoader {
	getResource(location: string): Resource
}

export const ResourceLoader = new (class extends Interface {
	readonly CLASSPATH_URL_PREFIX = ResourceUtils.CLASSPATH_URL_PREFIX
})('ResourceLoader')
