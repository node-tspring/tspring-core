import path from 'path'

const FOLDER_SEPARATOR = '/';

export class StringUtils {
	static applyRelativePath(path: string, relativePath: string): string {
    const separatorIndex = path.lastIndexOf(FOLDER_SEPARATOR);
		if (separatorIndex != -1) {
			let newPath = path.substring(0, separatorIndex);
			if (!relativePath.startsWith(FOLDER_SEPARATOR)) {
				newPath += FOLDER_SEPARATOR;
			}
			return newPath + relativePath;
		}
		else {
			return relativePath;
		}
	}

  static cleanPath(currentPath: string): string {
    return path.resolve(currentPath)
  }

  static getFilenameExtension(fileName: string | undefined) {
    return fileName != undefined ? path.extname(fileName) : undefined
  }

  static compareTo (s1: string, s2: string) {
    return s1 == s2
      ? 0
      : (s1 > s2 ? 1 : -1)
  }

  static parseTimeZoneString(zone: string | undefined): any {

  }

  static hasText(str: string | undefined): boolean {
    return (str != undefined && str.length > 0 && str.trim().length > 0)
  }

  static hasLength(str: string | undefined): boolean {
    return (str != undefined && str.length > 0)
  }

  static substringMatch(str: string, index: number, substring: string ) {
		if (index + substring.length > str.length) {
			return false
		}
		for (let i = 0; i < substring.length; i++) {
			if (str.charAt(index + i) != substring.charAt(i)) {
				return false
			}
		}
		return true
  }
}
