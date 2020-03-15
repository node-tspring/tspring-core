import { AliasRegistry } from './AliasRegistry'
import { StringValueResolver } from '../util/StringValueResolver'
import { IllegalStateException } from '../lang/exception/IllegalStateException'
import { Implements } from '../lang/type/Interface'

@Implements(AliasRegistry)
export class SimpleAliasRegistry implements AliasRegistry {
	private aliasMap = new Map<string, string>()

  canonicalName(name: string) {
		let canonicalName = name
		// Handle aliasing...
		let resolvedName
		do {
			resolvedName = this.aliasMap.get(canonicalName)
			if (resolvedName != undefined) {
				canonicalName = resolvedName
			}
		}
		while (resolvedName)
		return canonicalName
	}

	isAlias(name: string) {
		return this.aliasMap.has(name)
	}

	resolveAliases(valueResolver: StringValueResolver) {
		const aliasCopy = new Map<string, string>(this.aliasMap)
		aliasCopy.forEach((alias, registeredName) => {
			const resolvedAlias = valueResolver.resolveStringValue(alias)
			const resolvedName = valueResolver.resolveStringValue(registeredName)
			if (resolvedAlias == undefined || resolvedName == undefined || resolvedAlias == resolvedName) {
				this.aliasMap.delete(alias)
			}
			else if (resolvedAlias != alias) {
				const existingName = this.aliasMap.get(resolvedAlias)
				if (existingName != undefined) {
					if (existingName == resolvedName) {
						// Pointing to existing alias - just remove placeholder
						this.aliasMap.delete(alias)
						return
					}
					throw new IllegalStateException(`Cannot register resolved alias '${resolvedAlias}' (original: '${alias}') for name '${resolvedName}': It is already registered for name '${registeredName}'.`)
				}
				this.checkForAliasCircle(resolvedName, resolvedAlias)
				this.aliasMap.delete(alias)
				this.aliasMap.set(resolvedAlias, resolvedName)
			}
			else if (registeredName != resolvedName) {
				this.aliasMap.set(alias, resolvedName)
			}
		})
	}

	hasAlias(name: string, alias: string) {
		for (const [registeredAlias, registeredName] of this.aliasMap.entries()) {
			if (registeredName == name) {
				if (registeredAlias == alias || this.hasAlias(registeredAlias, alias)) {
					return true
				}
			}
		}
		return false
	}

	protected checkForAliasCircle(name: string, alias: string) {
		if (this.hasAlias(alias, name)) {
			throw new IllegalStateException(`Cannot register alias '${alias}' for name '${name}': Circular reference - '${name}' is a direct or indirect alias for '${alias}' already`)
		}
	}
}
