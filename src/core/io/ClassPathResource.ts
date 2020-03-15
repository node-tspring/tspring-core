import { AbstractFileResolvingResource } from './AbstractFileResolvingResource'
import { StringUtils } from '../../util/StringUtils'
import path from 'path'
import { URL } from 'url'
import { FileNotFoundException } from '../../lang/exception/FileNotFoundException'

const basePath = path.resolve('.')

export class ClassPathResource extends AbstractFileResolvingResource {
  private path: string

  constructor(path: string) {
    super()
		let pathToUse = StringUtils.cleanPath(path)
		if (pathToUse.startsWith('/')) {
			pathToUse = pathToUse.substring(1)
		}
		this.path = pathToUse
	}

  getPath() {
		return this.path
	}

	getFilename(): string | undefined {
    return path.basename(this.path)
  }

	protected resolveURL() {
		return new URL('file:' + path.resolve(path.join(basePath, this.path.substr(5))))
	}

	getURL(): URL {
		const url = this.resolveURL()
		if (url == null) {
			throw new FileNotFoundException(`${'this.getDescription()'} cannot be resolved to URL because it does not exist`)
		}
		return url
	}
}
