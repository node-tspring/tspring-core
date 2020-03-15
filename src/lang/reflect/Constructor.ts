import { Class } from '../type/Class'

export class Constructor<T extends Object> {
  constructor (
    private declaringClass: Class<T>,
    private parameterTypes: Class<any>[]) {
  }

  getDeclaringClass() {
    return this.declaringClass
  }

  getParameterTypes() {
    return this.parameterTypes
  }

  getName() {
    return this.declaringClass.name
  }

  newInstance(...params: any[]) {
    return new this.declaringClass(...params)
  }

}
