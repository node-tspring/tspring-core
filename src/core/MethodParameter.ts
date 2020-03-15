import { Method } from '../lang/reflect/Method'
import { Constructor } from '../lang/reflect/Constructor'
import { Class } from '../lang/type/Class'

export class MethodParameter {

  private containingClass?: Class<Object>
	private parameterType?: Class<Object>
  private executable: Method | Constructor<Object>

  constructor(original: MethodParameter)
  constructor(executable: Method | Constructor<Object>, parameterIndex?: number, nestingLevel?: number)
	constructor(arg1: Method | Constructor<Object> | MethodParameter, private parameterIndex?: number, private nestingLevel = 1) {
    if (arg1 instanceof MethodParameter) {
      const original = arg1
      this.executable = original.executable
      this.parameterIndex = original.parameterIndex
      // this.parameter = original.parameter
      this.nestingLevel = original.nestingLevel
      // this.typeIndexesPerLevel = original.typeIndexesPerLevel
      this.containingClass = original.containingClass
      this.parameterType = original.parameterType
      // this.genericParameterType = original.genericParameterType
      // this.parameterAnnotations = original.parameterAnnotations
      // this.parameterNameDiscoverer = original.parameterNameDiscoverer
      // this.parameterName = original.parameterName
    }

    else {
      this.executable = arg1
    }
  }

  getExecutable () {
    return this.executable
  }

  getMethod() {
		return this.executable instanceof Method ? this.executable : undefined
  }

  getDeclaringClass() {
    return this.executable.getDeclaringClass()
  }

  getParameterIndex() {
    return this.parameterIndex
  }

  getContainingClass() {
		return (this.containingClass != undefined ? this.containingClass : this.getDeclaringClass())
  }

  withContainingClass(containingClass: Class<Object> | undefined) {
    const result = this.clone()
		result.containingClass = containingClass
		result.parameterType = undefined
		return result
  }

  clone () {
		return new MethodParameter(this)
  }
}
