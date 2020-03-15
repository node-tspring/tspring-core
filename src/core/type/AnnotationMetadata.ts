import { ClassMetadata } from './ClassMetadata'
import { AnnotatedTypeMetadata } from './AnnotatedTypeMetadata'
import { Class } from '../../lang/type/Class'
import { Method } from '../../lang/reflect/Method'
import { Annotation } from '../../lang/annotation/Annotation'
import { Interface } from '../../lang/type/Interface'

export interface AnnotationMetadata extends ClassMetadata, AnnotatedTypeMetadata {
  getAnnotationTypes(): symbol[]

  hasAnnotatedMethods(annotation: Annotation): boolean

	getAnnotatedMethods(annotation: Annotation): Set<Method>
}

export const AnnotationMetadata = new (class extends Interface {
  introspect(type: Class<Object>) {
		return (Class.forName('@tspring/core:StandardAnnotationMetadata') as any).from(type)
	}
})('AnnotationMetadata', [ClassMetadata, AnnotatedTypeMetadata])
