import { CollectionUtils } from './CollectionUtils'

export abstract class ObjectUtils {
  static nullSafeEquals(o1: any, o2: any) {
    if (o1 == o2) {
			return true
		}
		if (o1 == undefined || o2 == undefined) {
			return false
		}
		if (typeof o1.equals == 'function' && o1.equals(o2)) {
			return true
    }

		return CollectionUtils.isEqual(o1, o2)
	}
}
