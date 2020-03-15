import { Interface } from '../../lang/type/Interface'

export interface Resource {
	exists(): boolean
  isReadable(): boolean
  isFile(): boolean
	getURL(): URL
	getFilename(): string | undefined
}

export const Resource = new Interface('Resource')
