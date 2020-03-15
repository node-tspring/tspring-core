import { Resource } from './Resource'
import { Interface } from '../../lang/type/Interface'

export interface WritableResource extends Resource {

}

export const WritableResource = new Interface('WritableResource', [Resource])
