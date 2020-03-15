import { Resource } from './Resource'
import { Interface } from '../../lang/type/Interface'

export interface ContextResource extends Resource {

}

export const ContextResource = new Interface('ContextResource', [Resource])
