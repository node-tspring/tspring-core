import { GenericConversionService } from './GenericConversionService'
import { ConversionService } from '../ConversionService'
import { ConverterRegistry } from '../converter/ConverterRegistry'
import { StringToNumberConverter } from './StringToNumberConverter'
import { NumberToStringConverter } from './NumberToStringConverter'

export class DefaultConversionService extends GenericConversionService {
	private static readonly sharedInstance = new DefaultConversionService()

	constructor() {
		super()
		DefaultConversionService.addDefaultConverters(this)
	}

  static getSharedInstance(): ConversionService {
		return DefaultConversionService.sharedInstance
  }

  static addDefaultConverters(converterRegistry: ConverterRegistry): void {
		this.addScalarConverters(converterRegistry)
		// this.addCollectionConverters(converterRegistry)

		// converterRegistry.addConverter(new ByteBufferConverter((ConversionService) converterRegistry))
		// converterRegistry.addConverter(new StringToTimeZoneConverter())
		// converterRegistry.addConverter(new ZoneIdToTimeZoneConverter())
		// converterRegistry.addConverter(new ZonedDateTimeToCalendarConverter())

		// converterRegistry.addConverter(new ObjectToObjectConverter())
		// converterRegistry.addConverter(new IdToEntityConverter((ConversionService) converterRegistry))
		// converterRegistry.addConverter(new FallbackObjectToStringConverter())
		// converterRegistry.addConverter(new ObjectToOptionalConverter((ConversionService) converterRegistry))
  }

	private static addScalarConverters(converterRegistry: ConverterRegistry): void {
    converterRegistry.addConverter(new StringToNumberConverter())
    converterRegistry.addConverter(new NumberToStringConverter())

		// converterRegistry.addConverterFactory(new StringToNumberConverterFactory())
		// converterRegistry.addConverter(Number.class, String.class, new ObjectToStringConverter())

		// converterRegistry.addConverter(new StringToCharacterConverter())
		// converterRegistry.addConverter(Character.class, String.class, new ObjectToStringConverter())

		// converterRegistry.addConverter(new NumberToCharacterConverter())
		// converterRegistry.addConverterFactory(new CharacterToNumberFactory())

		// converterRegistry.addConverter(new StringToBooleanConverter())
		// converterRegistry.addConverter(Boolean.class, String.class, new ObjectToStringConverter())

		// converterRegistry.addConverterFactory(new StringToEnumConverterFactory())
		// converterRegistry.addConverter(new EnumToStringConverter((ConversionService) converterRegistry))

		// converterRegistry.addConverterFactory(new IntegerToEnumConverterFactory())
		// converterRegistry.addConverter(new EnumToIntegerConverter((ConversionService) converterRegistry))

		// converterRegistry.addConverter(new StringToLocaleConverter())
		// converterRegistry.addConverter(Locale.class, String.class, new ObjectToStringConverter())

		// converterRegistry.addConverter(new StringToCharsetConverter())
		// converterRegistry.addConverter(Charset.class, String.class, new ObjectToStringConverter())

		// converterRegistry.addConverter(new StringToCurrencyConverter())
		// converterRegistry.addConverter(Currency.class, String.class, new ObjectToStringConverter())

		// converterRegistry.addConverter(new StringToPropertiesConverter())
		// converterRegistry.addConverter(new PropertiesToStringConverter())

		// converterRegistry.addConverter(new StringToUUIDConverter())
		// converterRegistry.addConverter(UUID.class, String.class, new ObjectToStringConverter())
  }

	static addCollectionConverters(converterRegistry: ConverterRegistry): void {
    // const conversionService = converterRegistry as any as ConversionService

		// converterRegistry.addConverter(new ArrayToCollectionConverter(conversionService))
		// converterRegistry.addConverter(new CollectionToArrayConverter(conversionService))

		// converterRegistry.addConverter(new ArrayToArrayConverter(conversionService))
		// converterRegistry.addConverter(new CollectionToCollectionConverter(conversionService))
		// converterRegistry.addConverter(new MapToMapConverter(conversionService))

		// converterRegistry.addConverter(new ArrayToStringConverter(conversionService))
		// converterRegistry.addConverter(new StringToArrayConverter(conversionService))

		// converterRegistry.addConverter(new ArrayToObjectConverter(conversionService))
		// converterRegistry.addConverter(new ObjectToArrayConverter(conversionService))

		// converterRegistry.addConverter(new CollectionToStringConverter(conversionService))
		// converterRegistry.addConverter(new StringToCollectionConverter(conversionService))

		// converterRegistry.addConverter(new CollectionToObjectConverter(conversionService))
		// converterRegistry.addConverter(new ObjectToCollectionConverter(conversionService))

		// converterRegistry.addConverter(new StreamConverter(conversionService))
  }
}
