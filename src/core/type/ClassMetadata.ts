import { Class } from '../../lang/type/Class'
import { Interface } from '../../lang/type/Interface'

export interface ClassMetadata {
  getClassName(): string

	isInterface(): boolean

	isAbstract(): boolean

	isConcrete(): boolean

	hasSuperClass(): boolean

	getClass(): Class<Object>

	getSuperClass(): Class<Object>
}

export const ClassMetadata = new Interface('ClassMetadata')
