import { Annotation, ElementType } from '../../lang/annotation/Annotation'

type AnnotationParams = {
  name?: string
  type?: string
} & Annotation.Params<string>

export const Param = Annotation.define<ElementType.PARAMETER, string, AnnotationParams>({
  name: 'Param',
  attributes: {
    value: {
      aliasFor: 'type',
      default: ''
    },
    type: {
      aliasFor: 'value',
      default: ''
    },
    name: {
      default: ''
    }
  }
})

export module Param {
  export type Params = AnnotationParams
}
