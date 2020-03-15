import { Class } from '../../../lang/type/Class'
import { ArrayMultiValueMap } from '../../../util/ArrayMultiValueMap'
import { URL } from 'url'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { IllegalArgumentException } from '../../../lang/exception/IllegalArgumentException'
import { AnnotationAwareOrderComparator } from '../../annotation/AnnotationAwareOrderComparator'
import { Interface } from '../../../lang/type/Interface'

const FACTORIES_RESOURCE_LOCATION = 'spring.factories.yml'
const cache = new Map<string, ArrayMultiValueMap<string, string>>()

export class SpringFactoriesLoader {

  static loadFactoryNames(factoryType: Class<Object> | Interface, basePath: URL): string[] {
    const factoryTypeName = Class.getFullName(factoryType)
		return this.loadSpringFactories(basePath).get(factoryTypeName, [])!
  }

  static loadFactories<T>(factoryType: Class<T> | Interface, basePath: URL): T[] {
		const factoryImplementationNames = SpringFactoriesLoader.loadFactoryNames(factoryType, basePath)
		console.debug(`Loaded [${factoryType}] names: ${factoryImplementationNames}`)
		const result: T[] = []
		for (const factoryImplementationName of factoryImplementationNames) {
			result.push(SpringFactoriesLoader.instantiateFactory(factoryImplementationName, factoryType))
		}
		AnnotationAwareOrderComparator.sort(result)
		return result
  }

  private static instantiateFactory<T>(factoryImplementationName: string, factoryType: Class<T> | Interface): T {
		try {
			const factoryImplementationClass = Class.forName<Object>(factoryImplementationName)
			if (!Class.isAssignableFrom(factoryType, factoryImplementationClass)) {
				throw new IllegalArgumentException(
						`Class [${factoryImplementationName}] is not assignable to factory type [${factoryType}]`)
			}
			return new factoryImplementationClass() as T
		} catch (ex) {
			throw new IllegalArgumentException(`Unable to instantiate factory class [${factoryImplementationName}] for factory type [${factoryType.name}]`, ex)
		}
	}

  private static loadSpringFactories(basePath: URL) {
		let result = cache.get(basePath.pathname)
		if (result != undefined) {
			return result
		}

		try {
			// const urls = [FACTORIES_RESOURCE_LOCATION]
			const urls = [new URL('file:' + path.join(basePath.pathname, FACTORIES_RESOURCE_LOCATION))]
      result = new ArrayMultiValueMap<string, string>()
      urls.forEach((url) => {
        const data = yaml.load(fs.readFileSync(url).toString())

        for (const key in data) {
          const factoryTypeName = key.trim()
          const val = data[key]
          for (const factoryImplementationName of val) {
            result!.add(factoryTypeName, factoryImplementationName.trim())
          }
        }
      })
			cache.set(basePath.pathname, result)
			return result
		}
		catch (ex) {
			throw new IllegalArgumentException(`Unable to load factories from location [${basePath}:${FACTORIES_RESOURCE_LOCATION}]`, ex)
		}
	}
}
