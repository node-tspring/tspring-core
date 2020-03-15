import { AbstractFileResolvingResource } from './AbstractFileResolvingResource'
import { StringUtils } from '../../util/StringUtils'

export class UrlResource extends AbstractFileResolvingResource {
  private url: URL
  private cleanedUrl: URL

  constructor(url: URL) {
    super()
		this.url = url
		this.cleanedUrl = this.getCleanedUrl(this.url, url.toString())
		// this.uri = undefined
	}

	getURL() {
		return this.cleanedUrl
	}

  getCleanedUrl(originalUrl: URL, originalPath: string) {
		const cleanedPath = StringUtils.cleanPath(originalPath)
		if (cleanedPath != originalPath) {
			try {
				return new URL(cleanedPath)
			}
			catch (ex) {
				// Cleaned URL path cannot be converted to URL -> take original URL.
			}
		}
		return originalUrl
	}
}
