import { Class } from '../lang/type/Class'
import { Type } from '../lang/reflect/Type'
import { SerializableTypeWrapper } from './SerializableTypeWrapper'
import { TypeVariable } from '../lang/reflect/TypeVariable'
import { GenericArrayType } from '../lang/reflect/GenericArrayType'
import { GenericDeclaration } from '../lang/reflect/GenericDeclaration'
import { ParameterizedType } from '../lang/reflect/ParameterizedType'
import { WildcardType } from '../lang/reflect/WildcardType'
import { Interface, Implements } from '../lang/type/Interface'

type TypeProvider = SerializableTypeWrapper.TypeProvider
type VariableResolver = ResolvableType.VariableResolver

@Implements(Type)
class EmptyType implements Type {
  readonly name = 'EmptyType'

  static readonly INSTANCE = new EmptyType()

  readResolve() {
    return EmptyType.INSTANCE
  }
}

export class ResolvableType {
  private type: Type
  private typeProvider?: TypeProvider
  private variableResolver?: VariableResolver
  private hash?: number
  private componentType?: ResolvableType
  private resolved?: Class<Object>
  static readonly NONE = new ResolvableType(EmptyType.INSTANCE, undefined, undefined, 0)

  private constructor(type: Type, typeProvider?: TypeProvider, variableResolver?: VariableResolver)
  private constructor(type: Type, typeProvider?: TypeProvider, variableResolver?: VariableResolver, hash?: number)
  private constructor(type: Type, typeProvider?: TypeProvider, variableResolver?: VariableResolver, componentType?: ResolvableType)
  private constructor(clazz: Class<Object> )

  private constructor(arg1: Type | Class<Object>, typeProvider?: TypeProvider, variableResolver?: VariableResolver, arg4?: ResolvableType | number) {
    if (Class.isClass(arg1)) {
      this.resolved = (arg1 != undefined ? arg1 : Object)
      this.type = this.resolved
		  this.typeProvider = undefined
		  this.variableResolver = undefined
		  this.componentType = undefined
		  this.hash = undefined
    }

    else {
      this.type = arg1
      this.typeProvider = typeProvider!
      this.variableResolver = variableResolver!

      if (typeof arg4 == 'number') {
        this.hash = arg4
        this.resolved = this.resolveClass()
      }

      else if (arg4 instanceof ResolvableType) {
        this.componentType = arg4
        // this.hash = this.calculateHashCode()
        this.resolved = this.resolveClass()
      }
    }
  }

  getComponentType(): ResolvableType {
		if (this == ResolvableType.NONE) {
			return ResolvableType.NONE
		}
		if (this.componentType != undefined) {
			return this.componentType
		}
		// if (Class.isClass(this.type)) {
		// 	const componentType = this.type.getComponentType()
		// 	return this.forType(componentType, this.variableResolver)
		// }
		if (Class.isImplements<GenericArrayType>(this.type, GenericArrayType)) {
			return this.forType(this.type.getGenericComponentType(), this.variableResolver)
		}
		return this.resolveType().getComponentType()
	}

  private resolveClass(): Class<Object> | undefined {
		if (this.type == EmptyType.INSTANCE) {
			return undefined
		}
		if (Class.isClass(this.type)) {
			return this.type
		}
		if (Class.isImplements<GenericArrayType>(this.type, GenericArrayType)) {
			const resolvedComponent = this.getComponentType().resolve()
			// return (resolvedComponent != undefined ? Array.newInstance(resolvedComponent, 0).getClass() : undefined)
			return (resolvedComponent != undefined ? Array : undefined)
		}
		return this.resolveType().resolve()
  }

  protected resolveType() {
		if (Class.isImplements<ParameterizedType>(this.type, ParameterizedType)) {
			return this.forType(this.type.getRawType(), this.variableResolver)
		}
		if (Class.isImplements<WildcardType>(this.type, WildcardType)) {
			let resolved = this.resolveBounds(this.type.getUpperBounds())
			if (resolved == undefined) {
				resolved = this.resolveBounds(this.type.getLowerBounds())
			}
			return this.forType(resolved, this.variableResolver)
		}
		if (Class.isImplements<TypeVariable<GenericDeclaration>>(this.type, TypeVariable)) {
			const variable = this.type
			// Try default variable resolution
			if (this.variableResolver != undefined) {
				const resolved = this.variableResolver.resolveVariable(variable)
				if (resolved != undefined) {
					return resolved
				}
			}
			// Fallback to bounds
			return this.forType(this.resolveBounds(variable.getBounds()), this.variableResolver)
		}
		return ResolvableType.NONE
  }

  private resolveBounds(bounds: Type[]): Type | undefined {
		if (bounds.length == 0 || bounds[0] == Object) {
			return undefined
		}
		return bounds[0]
	}

  forType(...args: any[]) {
    return ResolvableType.NONE
  }

  resolve(): Class<Object> | undefined
  resolve(fallback: Class<Object>): Class<Object>

  resolve(fallback?: Class<Object>) {
		return (this.resolved != undefined ? this.resolved : fallback)
	}
}

export module ResolvableType {
  export interface VariableResolver {

		getSource(): Object

		resolveVariable(variable: TypeVariable<Object> ): ResolvableType | undefined
	}
	export const VariableResolver = new Interface('VariableResolver')
}
