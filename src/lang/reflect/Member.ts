import { Class } from '../type/Class'
import { Interface } from '../type/Interface'

export interface Member {
  getDeclaringClass(): Class<Object>
  getName(): string | symbol
}

export const Member = new Interface('Member')
