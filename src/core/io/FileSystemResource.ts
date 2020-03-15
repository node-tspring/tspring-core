import { AbstractResource } from './AbstractResource'
import { WritableResource } from './WritableResource'
import { URL } from 'url'
import fs from 'fs'
import path from 'path'
import { Implements } from '../../lang/type/Interface'

@Implements(WritableResource)
export class FileSystemResource extends AbstractResource implements WritableResource {
  private url: URL
  private path: string

	constructor(path: fs.PathLike) {
    super()
    if (path instanceof URL) {
      this.path = path.pathname
      this.url = path
    }

    else {
      this.path = (path + '').replace(/^file:\/\//i, '')
      this.url = new URL(`file://${this.path}`)
    }
  }

  getPath(): string {
		return this.path
	}

  getFilename() {
    return path.basename(this.path)
  }

  exists () {
    return fs.existsSync(this.path)
  }

  isFile () {
    return this.exists()
      ? fs.statSync(this.path).isFile()
      : false
  }

  getURL() {
    return this.url
  }
}
