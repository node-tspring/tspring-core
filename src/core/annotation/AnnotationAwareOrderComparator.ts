import { OrderComparator } from '../OrderComparator'
import { Class } from '../../lang/type/Class'
import { Order } from './Order'

export class AnnotationAwareOrderComparator extends OrderComparator {
  static readonly INSTANCE = new AnnotationAwareOrderComparator()

  protected findOrder(obj: Object) {
		const order = super.findOrder(obj)
		if (order != undefined) {
			return order
		}
		return this.findOrderFromAnnotation(obj)
	}

  private findOrderFromAnnotation(obj: Object): number | undefined {
    const orderParams =  Class.findAnnotationParams<Order.Params>(obj.constructor as Class<Object>, Order)
    if (orderParams) {
      return orderParams.value
    }
		return undefined
  }

  static sort<T>(list: T[]) {
		if (list.length > 1) {
			const comparator = AnnotationAwareOrderComparator.INSTANCE
			list.sort((o1, o2) => comparator.compare(o1, o2))
		}
  }

  static sortIfNecessary(value: Object) {
		if (Array.isArray(value)) {
			AnnotationAwareOrderComparator.sort(value)
		}
	}
}
