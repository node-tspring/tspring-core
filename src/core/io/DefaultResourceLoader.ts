import { ResourceLoader } from './ResourceLoader'
import { Resource } from './Resource'
import { ProtocolResolver } from './ProtocolResolver'
import { ResourceUtils } from '../../util/ResourceUtils'
import { ClassPathResource } from './ClassPathResource'
import { ContextResource } from './ContextResource'
import { StringUtils } from '../../util/StringUtils'
import { FileUrlResource } from './FileUrlResource'
import { UrlResource } from './UrlResource'
import { Implements } from '../../lang/type/Interface'
import { URL } from 'url'
import path from 'path'

const basePath = path.resolve('.')
@Implements(ContextResource)
class ClassPathContextResource extends ClassPathResource implements ContextResource {

	constructor(path: string) {
		super(path)
	}

	getPathWithinContext() {
		return this.getPath()
	}

	createRelative(relativePath: string) {
		const pathToUse = StringUtils.applyRelativePath(this.getPath(), relativePath)
		return new ClassPathContextResource(pathToUse)
	}
}

@Implements(ResourceLoader)
export class DefaultResourceLoader implements ResourceLoader {
  private protocolResolvers = new Set<ProtocolResolver>()

  getResource(location: string): Resource {
		for (const protocolResolver of this.getProtocolResolvers()) {
			const resource = protocolResolver.resolve(location, this)
			if (resource != undefined) {
				return resource
			}
		}

		if (location.startsWith('/')) {
			return this.getResourceByPath(location)
		}
		else if (location.startsWith(ResourceLoader.CLASSPATH_URL_PREFIX)) {
			return new ClassPathResource(location.substring(ResourceLoader.CLASSPATH_URL_PREFIX.length))
		}
		else {
			try {
				// Try to parse the location as a URL...
				let url = new URL(location)
				if (ResourceUtils.isFileURL(url)) {
					const [protocol, filePath] = location.split(':')
					if (!path.isAbsolute(filePath)) {
						// 如果是相对路径，转换成绝对路径
						url = new URL(`${protocol}:${path.resolve(path.join(basePath, filePath))}`)
					}
					return new FileUrlResource(url)
				} else {
					return new UrlResource(url)
				}
			}
			catch (ex) {
				// No URL -> resolve as resource path.
				return this.getResourceByPath(location)
			}
		}
  }

  protected getResourceByPath(path: string) {
		return new ClassPathContextResource(path)
  }

  addProtocolResolver(resolver: ProtocolResolver) {
		this.protocolResolvers.add(resolver)
	}

  getProtocolResolvers(): Iterable<ProtocolResolver> {
		return this.protocolResolvers
	}

	protected static ClassPathContextResource = ClassPathContextResource
}
