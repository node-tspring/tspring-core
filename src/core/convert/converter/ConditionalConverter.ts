import { TypeDescriptor } from '../TypeDescriptor'
import { Interface } from '../../../lang/type/Interface'

export interface ConditionalConverter  {
	matches(sourceType: TypeDescriptor, targetType: TypeDescriptor): boolean
}

export const ConditionalConverter = new Interface('ConditionalConverter')

