import { Annotation, ElementType } from '../../lang/annotation/Annotation'
import { Ordered } from '../Ordered'

type AnnotationParams = {} & Annotation.Params<number>

export const Order = Annotation.define<ElementType.TYPE & ElementType.METHOD & ElementType.FIELD, number, AnnotationParams>({
  name: 'Order',
  attributes: {
    value: {
      default: Ordered.LOWEST_PRECEDENCE
    }
  }
})

export module Order {
  export type Params = AnnotationParams
}
