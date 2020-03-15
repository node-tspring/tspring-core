import { MapPropertySource } from './MapPropertySource'
import { Properties } from '../../lang/Properties'

export class PropertiesPropertySource extends MapPropertySource {
	constructor(name: string, source: Properties)
  constructor(name: string, source: Map<string, Object>)

  constructor(name: string, source: Properties | Map<string, Object>) {
    super(name, source as Map<string, Object>)
  }

}
