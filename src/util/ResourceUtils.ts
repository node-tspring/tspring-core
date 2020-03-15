import { URL } from 'url'
const CLASSPATH_URL_PREFIX = 'classpath:'
const URL_PROTOCOL_FILE = 'file:'
const URL_PROTOCOL_VFSFILE = 'vfsfile:'
const URL_PROTOCOL_VFS = 'vfs:'
const FILE_URL_PREFIX = 'file:'

export abstract class ResourceUtils {
  static CLASSPATH_URL_PREFIX = CLASSPATH_URL_PREFIX
  static URL_PROTOCOL_FILE = URL_PROTOCOL_FILE
  static URL_PROTOCOL_VFSFILE = URL_PROTOCOL_VFSFILE
  static URL_PROTOCOL_VFS = URL_PROTOCOL_VFS
  static FILE_URL_PREFIX = FILE_URL_PREFIX

  static isFileURL(url: URL) {
    const protocol = url.protocol
    return URL_PROTOCOL_FILE == protocol ||
      URL_PROTOCOL_VFSFILE == protocol ||
			URL_PROTOCOL_VFS == protocol
  }

  static isUrl(resourceLocation: string | undefined) {
		if (resourceLocation == undefined) {
			return false
		}
		if (resourceLocation.startsWith(CLASSPATH_URL_PREFIX)) {
			return true
		}
		try {
			new URL(resourceLocation)
			return true
		}
		catch (ex) {
			return false
		}
	}
}
