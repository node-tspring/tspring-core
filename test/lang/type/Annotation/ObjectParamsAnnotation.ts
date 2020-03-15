import { Annotation, ElementType } from "../../../../src/lang/annotation/Annotation"

type AnnotationParams = {
  a?: number
  b?: string
  c?: {
    x?: number
    y?: string
    z?: {
      m?: number,
      n?: string
    }
  }
} & Annotation.Params<number>

export const ObjectParamsAnnotation = Annotation.define<ElementType.TYPE, number, AnnotationParams>({
  name: 'ObjectParamsAnnotation',
  attributes: {
    value: {
      default: 100
    },
    a: {
      default: 101
    },
    b: {
      default: 'b'
    },
    c: {
      default: {
        x: 102,
        y: 'y',
        z: {
          m: 103,
          n: 'n'
        }
      }
    }
  }
})

export module ObjectParamsAnnotation {
  export type Params = AnnotationParams
}
