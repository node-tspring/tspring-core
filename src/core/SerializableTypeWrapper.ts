import { Type } from '../lang/reflect/Type'
import { Interface } from '../lang/type/Interface'

export class SerializableTypeWrapper {

}

export module SerializableTypeWrapper {
  export interface TypeProvider {
		getType(): Type | undefined
		getSource(): Object | undefined
	}

	export const TypeProvider = new Interface('TypeProvider')

}
