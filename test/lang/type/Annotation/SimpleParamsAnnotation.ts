import { Annotation, ElementType } from "../../../../src/lang/annotation/Annotation"

type AnnotationParams = {} & Annotation.Params<string>
export const SimpleParamsAnnotation = Annotation.define<ElementType.TYPE, string, AnnotationParams>({
  name: 'SimpleParamsAnnotation',
  attributes: {
    value: {
      default: 'defaultStringVaule'
    }
  }
})

export module SimpleParamsAnnotation {
  export type Params = AnnotationParams
}
