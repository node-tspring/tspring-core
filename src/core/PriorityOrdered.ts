import { Ordered } from './Ordered'
import { Interface } from '../lang/type/Interface'

export interface PriorityOrdered extends Ordered {

}

export const PriorityOrdered = new Interface('PriorityOrdered', [Ordered])
