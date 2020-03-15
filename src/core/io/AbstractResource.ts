import { Resource } from './Resource'
import { Implements } from '../../lang/type/Interface'

@Implements(Resource)
export abstract class AbstractResource implements Resource {
  exists(): boolean {
    return false
  }

  getURL(): URL {
    throw new Error('Method not implemented.')
  }

  getFilename(): string | undefined {
    return undefined
  }

  isReadable() {
		return this.exists()
  }

  isFile() {
		return false
	}
}
