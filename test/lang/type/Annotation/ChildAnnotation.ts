import { Annotation, ElementType } from "../../../../src/lang/annotation/Annotation"
import { ObjectParamsAnnotation } from "./ObjectParamsAnnotation"

type AnnotationParams = {
  a: number
} & Annotation.Params<number>

export const ChildAnnotation = Annotation.define<ElementType.TYPE, number, AnnotationParams>({
  name: 'ObjectParamsAnnotation',
  attributes: {
    value: {
      default: 210
    },
    a: {
      aliasFor: {
        annotation: ObjectParamsAnnotation
      }
    }
  },
  extends: [ObjectParamsAnnotation]
})

export module ChildAnnotation {
  export type Params = AnnotationParams
}
