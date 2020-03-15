import { Converter } from '../converter/Converter'
import { Implements } from '../../../lang/type/Interface'
import { StringUtils } from '../../../util/StringUtils'
import { PrimitiveType } from '../../../lang/type/PrimitiveType'

@Implements(Converter)
export class StringToNumberConverter implements Converter<string, number> {

  convert(source: string): number | undefined {
    if (!StringUtils.hasText(source)) {
      return undefined
    }
    return parseFloat(source)
  }

  getSourceType() {
    return PrimitiveType.string
  }

  getTargetType() {
    return PrimitiveType.number
  }

}
