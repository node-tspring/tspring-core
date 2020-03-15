import { GenericConverter } from './GenericConverter'
import { ConditionalConverter } from './ConditionalConverter'
import { Interface } from '../../../lang/type/Interface'

export interface ConditionalGenericConverter extends GenericConverter, ConditionalConverter {

}

export const ConditionalGenericConverter = new Interface(
  'ConditionalGenericConverter',
  [GenericConverter, ConditionalConverter]
)
