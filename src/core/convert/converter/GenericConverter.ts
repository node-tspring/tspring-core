import { TypeDescriptor } from '../TypeDescriptor'
import { TypeDef } from '../../../lang/type/TypeDef'
import { Interface } from '../../../lang/type/Interface'

class ConvertiblePair {

	private sourceType: TypeDef

	private targetType: TypeDef

	constructor(sourceType: TypeDef, targetType: TypeDef) {
		this.sourceType = sourceType
		this.targetType = targetType
	}

	getSourceType(): TypeDef {
		return this.sourceType
	}

	getTargetType(): TypeDef {
		return this.targetType
	}

	equals(other: Object | undefined ): boolean {
		if (this == other) {
			return true
		}
		if (other == undefined || other.constructor != ConvertiblePair) {
			return false
		}
		const otherPair = other as ConvertiblePair
		return (this.sourceType == otherPair.sourceType && this.targetType == otherPair.targetType)
	}

	// hashCode(): number {
	// 	return (this.sourceType.hashCode() * 31 + this.targetType.hashCode())
	// }

	toString() {
		return `${this.sourceType.name} -> ${this.targetType.name}`
	}
}

export interface GenericConverter {
	getConvertibleTypes(): Set<ConvertiblePair> | undefined

  convert(source: Object | undefined, sourceType: TypeDescriptor, targetType: TypeDescriptor): Object | undefined
}

type TypeConvertiblePair = ConvertiblePair

export module GenericConverter {
	export type ConvertiblePair = TypeConvertiblePair
}

export const GenericConverter = new (class extends Interface {
	readonly ConvertiblePair = ConvertiblePair
})('GenericConverter')

