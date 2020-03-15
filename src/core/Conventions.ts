import { Class } from '../lang/type/Class'

export class Conventions {
  static getQualifiedAttributeName(enclosingClass: Class<Object>, attributeName: string) {
		return enclosingClass.name + '.' + attributeName
	}
}
