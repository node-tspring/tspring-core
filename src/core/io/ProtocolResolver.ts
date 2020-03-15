import { ResourceLoader } from './ResourceLoader'
import { Resource } from './Resource'
import { Interface } from '../../lang/type/Interface'

export interface ProtocolResolver {
	resolve(location: string, resourceLoader: ResourceLoader): Resource
}

export const ProtocolResolver = new Interface('ProtocolResolver')
