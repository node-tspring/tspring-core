import { Converter } from '../converter/Converter'
import { Implements } from '../../../lang/type/Interface'
import { PrimitiveType } from '../../../lang/type/PrimitiveType'

@Implements(Converter)
export class NumberToStringConverter implements Converter<number, string> {

  convert(source: number): string | undefined {
    return source != undefined ? source.toString() : undefined
  }

  getSourceType() {
    return PrimitiveType.number
  }

  getTargetType() {
    return PrimitiveType.string
  }

}
