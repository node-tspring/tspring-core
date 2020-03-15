import { Annotation, ElementType } from "../../../../src/lang/annotation/Annotation"
import { ChildAnnotation } from "./ChildAnnotation"

type AnnotationParams = {
  a: number
} & Annotation.Params<number>

export const ChildChildAnnotation = Annotation.define<ElementType.TYPE, number, AnnotationParams>({
  name: 'ObjectParamsAnnotation',
  attributes: {
    value: {
      default: 310
    },
    a: {
      aliasFor: {
        annotation: ChildAnnotation
      }
    }
  },
  extends: [ChildAnnotation]
})

export module ChildChildAnnotation {
  export type Params = AnnotationParams
}
