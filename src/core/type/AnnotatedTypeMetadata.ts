import { Annotation } from '../../lang/annotation/Annotation'
import { Interface } from '../../lang/type/Interface'

export interface AnnotatedTypeMetadata {
	isAnnotated(annotation: Annotation): boolean
	getAnnotationParams<T extends Annotation.Params<Annotation.Value>>(annotation: Annotation): T | undefined
}

export const AnnotatedTypeMetadata = new Interface('AnnotatedTypeMetadata')
