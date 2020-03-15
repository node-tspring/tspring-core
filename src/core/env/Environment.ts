import { PropertyResolver } from './PropertyResolver'
import { Interface } from '../../lang/type/Interface'

export interface Environment extends PropertyResolver {
  getActiveProfiles(): string[]
	getDefaultProfiles(): string[]

	// acceptsProfiles(profiles: Profiles): boolean
}

export const Environment = new Interface('Environment', [PropertyResolver])
