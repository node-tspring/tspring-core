import { ConfigurableConversionService } from './ConfigurableConversionService'
import { Class } from '../../../lang/type/Class'
import { Converter } from '../converter/Converter'
import { TypeDescriptor } from '../TypeDescriptor'
import { GenericConverter } from '../converter/GenericConverter'
import { ConditionalGenericConverter } from '../converter/ConditionalGenericConverter'
import { CollectionUtils } from '../../../util/CollectionUtils'
import { ConditionalConverter } from '../converter/ConditionalConverter'
import { GenericType } from '../../../lang/type/GenericType'
import { IllegalArgumentException } from '../../../lang/exception/IllegalArgumentException'
import { PrimitiveType } from '../../../lang/type/PrimitiveType'
import { TypeDef } from '../../../lang/type/TypeDef'
import { ConverterFactory } from '../converter/ConverterFactory'
import { Implements } from '../../../lang/type/Interface'
import { ConversionFailedException } from '../ConversionFailedException'
import { ConverterNotFoundException } from '../ConverterNotFoundException'

type ConvertiblePair = GenericConverter.ConvertiblePair
const ConvertiblePair = GenericConverter.ConvertiblePair

class NoOpConverter implements GenericConverter {

  constructor(private name: string) {}

  getConvertibleTypes(): Set<ConvertiblePair> | undefined {
    return undefined
  }

  convert(source: Object | undefined, sourceType: TypeDescriptor, targetType: TypeDescriptor): Object | undefined {
    return source
  }

  toString() {
    return this.name
  }
}

class ConvertersForPair {

  private converters: GenericConverter[] = []

  add(converter: GenericConverter) {
    this.converters.push(converter)
  }

  getConverter(sourceType: TypeDescriptor, targetType: TypeDescriptor): GenericConverter | undefined {
    for (const converter of this.converters) {
      if (!Class.isImplements<ConditionalGenericConverter>(converter, ConditionalGenericConverter) ||
          converter.matches(sourceType, targetType)) {
        return converter
      }
    }
    return undefined
  }

  toString() {
    return this.converters.join(',')
  }
}

class Converters {
  private globalConverters = new Set<ConditionalGenericConverter>()
  private converters = new Map<string, ConvertersForPair>()

  add(converter: ConditionalGenericConverter) {
    const convertibleTypes = converter.getConvertibleTypes()
    if (convertibleTypes == undefined) {
      this.globalConverters.add(converter)
    }
    else {
      for (const convertiblePair of convertibleTypes) {
        const convertersForPair = this.getMatchableConverters(convertiblePair)
        convertersForPair.add(converter)
      }
    }
  }

  find(sourceType: TypeDescriptor, targetType: TypeDescriptor): GenericConverter | undefined {
    // Search the full type hierarchy
    const sourceCandidates = [sourceType] // this.getClassHierarchy(sourceType)
    const targetCandidates = [targetType] // this.getClassHierarchy(targetType)
    for (const sourceCandidate of sourceCandidates) {
      for (const targetCandidate of targetCandidates) {
        const convertiblePair = new ConvertiblePair(sourceCandidate.getType(), targetCandidate.getType())
        const converter = this.getRegisteredConverter(sourceType, targetType, convertiblePair)
        if (converter != undefined) {
          return converter
        }
      }
    }
    return undefined
  }

  private getClassHierarchy(type: Class<Object>): Class<Object>[] {
    return []
  }

  private getRegisteredConverter(sourceType: TypeDescriptor, targetType: TypeDescriptor, convertiblePair: ConvertiblePair): GenericConverter | undefined {

    // Check specifically registered converters
    const convertersForPair = this.converters.get(convertiblePair.toString())
    if (convertersForPair != undefined) {
      const converter = convertersForPair.getConverter(sourceType, targetType)
      if (converter != null) {
        return converter
      }
    }
    // Check ConditionalConverters for a dynamic match
    for (const globalConverter of this.globalConverters) {
      if (globalConverter.matches(sourceType, targetType)) {
        return globalConverter
      }
    }
    return undefined
  }

  private getMatchableConverters(convertiblePair: ConvertiblePair) {
    let convertersForPair = this.converters.get(convertiblePair.toString())
    if (convertersForPair == null) {
      convertersForPair = new ConvertersForPair()
      this.converters.set(convertiblePair.toString(), convertersForPair)
    }
    return convertersForPair
  }
}

const NO_OP_CONVERTER = new NoOpConverter('NO_OP')

@Implements(ConditionalGenericConverter)
class ConverterAdapter implements ConditionalGenericConverter {

  private converter: Converter<any, any> | (Converter<any, any> & ConditionalConverter)

  private typeInfo: ConvertiblePair

  private targetType: TypeDef

  constructor(converter: Converter<any, any> | (Converter<any, any> & ConditionalConverter), sourceType: TypeDef, targetType:  TypeDef) {
    this.converter = converter
    this.typeInfo = new ConvertiblePair(sourceType, targetType)
    this.targetType = targetType
  }

  getConvertibleTypes(): Set<ConvertiblePair> {
    return CollectionUtils.singleton(this.typeInfo)
  }

  matches(sourceType: TypeDescriptor, targetType: TypeDescriptor): boolean {
    // Check raw type first...
    if (this.typeInfo.getTargetType() != targetType.getType()) {
      return false
    }

    if (GenericType.isAssignableFrom(targetType.getType(), sourceType.getType())) {
      return false
    }

    return !Class.isImplements<ConditionalConverter>(this.converter, ConditionalConverter) ||
      this.converter.matches(sourceType, targetType)
  }

  convert(source: Object | undefined, sourceType: TypeDescriptor, targetType: TypeDescriptor): Object | undefined {
    if (source == undefined) {
      return undefined // convertNullSource(sourceType, targetType)
    }
    return this.converter.convert(source)
  }

  toString() {
    return `${this.typeInfo} : ${this.converter}`
  }
}

@Implements(ConfigurableConversionService)
export class GenericConversionService implements ConfigurableConversionService {
  private converters = new Converters()

  addConverterFactory(factory: ConverterFactory<any, any>): void {
    throw new Error('Method not implemented.')
  }

  addConverter(converter: Converter<any, any>): void
  addConverter(converter: ConditionalGenericConverter): void
  addConverter(converter: Converter<any, any> | ConditionalGenericConverter): void {
    if (Class.isImplements<ConditionalGenericConverter>(converter, GenericConverter)) {
      this.converters.add(converter)
    }
    else {
		  this.addConverter(new ConverterAdapter(converter, converter.getSourceType(), converter.getTargetType()))
    }
  }

  canConvert(sourceType: TypeDef, targetType: TypeDef): boolean
  canConvert(sourceType: TypeDescriptor, targetType: TypeDescriptor): boolean
  canConvert(sourceType: TypeDef | TypeDescriptor, targetType: TypeDef | TypeDescriptor): boolean {
    if (!(sourceType instanceof TypeDescriptor)) {
      sourceType = TypeDescriptor.fromClass(sourceType)
    }
    if (!(targetType instanceof TypeDescriptor)) {
      targetType = TypeDescriptor.fromClass(targetType)
    }
		if (sourceType == undefined) {
			return true
		}
		const converter = this.getConverter(sourceType, targetType)
		return (converter != undefined)
  }

  protected getConverter(sourceType: TypeDescriptor, targetType: TypeDescriptor) {
		// ConverterCacheKey key = new ConverterCacheKey(sourceType, targetType)
		// GenericConverter converter = this.converterCache.get(key)
		// if (converter != null) {
			// return (converter != NO_MATCH ? converter : null)
		// }

		let converter = this.converters.find(sourceType, targetType)
		if (converter == undefined) {
			converter = this.getDefaultConverter(sourceType, targetType)
		}

		if (converter != undefined) {
			// this.converterCache.put(key, converter)
			return converter
		}

		// this.converterCache.set(key, NO_MATCH)
		return undefined
  }

  protected getDefaultConverter(sourceType: TypeDescriptor, targetType: TypeDescriptor): GenericConverter | undefined {
    return GenericType.isAssignableFrom(targetType.getType(), sourceType.getType())
      ? NO_OP_CONVERTER
      : undefined
	}

  convert<T>(source: any, targetType: TypeDef | TypeDescriptor): T | undefined {
    console.log('GenericConversionService#convert+++>>> ', source)
    if (!(targetType instanceof TypeDescriptor)) {
      targetType = TypeDescriptor.fromClass(targetType)
    }
    const sourceType = source != undefined ? TypeDescriptor.fromObject(source) : undefined
		if (sourceType == undefined) {
      throw new Error()
			// return this.handleResult(undefined, targetType, this.convertNullSource(undefined, targetType))
		}
		if (source != undefined && !(GenericType.isMatch(source, sourceType.getType()))) {
			throw new IllegalArgumentException(`Source to convert from must be an instance of [${sourceType}]; instead it was a [${source.getClass().getName()}]`)
		}
		const converter = this.getConverter(sourceType, targetType)
		if (converter != undefined) {
      // const result = ConversionUtils.invokeConverter(converter, source, sourceType, targetType)
      const result = converter.convert(source, sourceType, targetType) as T | undefined
			return this.handleResult(sourceType, targetType, result)
		}
		return this.handleConverterNotFound(source, sourceType, targetType)
  }

  private handleConverterNotFound<T>(source: Object | undefined, sourceType: TypeDescriptor | undefined, targetType: TypeDescriptor): T | undefined {

    if (source == undefined) {
      this.assertNotPrimitiveTargetType(sourceType, targetType)
      return undefined
    }
    if ((sourceType == undefined || GenericType.isAssignableFrom(targetType.getType(), sourceType.getType())) && targetType.isInstance(source)) {
      return source as T
    }
    console.log(`ConverterNotFoundException: ${sourceType} -> ${targetType}`)
    throw new ConverterNotFoundException(sourceType, targetType)
  }

  private handleResult<T>(sourceType: TypeDescriptor | undefined, targetType: TypeDescriptor, result: T | undefined ): T | undefined {
		if (result == undefined) {
			this.assertNotPrimitiveTargetType(sourceType, targetType)
		}
		return result
	}

  private assertNotPrimitiveTargetType(sourceType: TypeDescriptor | undefined, targetType: TypeDescriptor) {
		if (targetType instanceof PrimitiveType) {
			throw new ConversionFailedException(
        sourceType,
        targetType,
        undefined,
        new IllegalArgumentException('A null value cannot be assigned to a primitive type')
      )
		}
	}
}
