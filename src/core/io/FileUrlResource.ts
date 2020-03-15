import { WritableResource } from './WritableResource'
import { UrlResource } from './UrlResource'
import { Implements } from '../../lang/type/Interface'
import path from 'path'
import fs from 'fs'
import { FileNotFoundException } from '../../lang/exception/FileNotFoundException'

const basePath = path.resolve('.')

@Implements(WritableResource)
export class FileUrlResource extends UrlResource implements WritableResource {
  private filePath: string
  private fileName: string

  constructor(filePath: string)
  constructor(url: URL)

  constructor(arg1: string | URL) {
    super(typeof arg1 == 'string'
      ? new URL('file:' + path.resolve(
        path.isAbsolute(arg1)
          ? arg1
          : path.join(basePath, arg1)
        ))
      : arg1)
    this.filePath = this.getURL().pathname
    if (!fs.existsSync(this.filePath)) {
			throw new FileNotFoundException(`${'this.getDescription()'} cannot be resolved to URL because it does not exist`)
    }
    this.fileName = path.basename(this.filePath)
	}

  getPath() {
		return this.filePath
	}

	getFilename(): string | undefined {
    return this.fileName
  }
}
