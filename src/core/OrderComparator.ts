import { Comparator } from '../lang/Comparator'
import { PriorityOrdered } from './PriorityOrdered'
import { Ordered } from './Ordered'
import { Class } from '../lang/type/Class'
import { Interface, Implements } from '../lang/type/Interface'

type OrderSourceProvider = OrderComparator.OrderSourceProvider

@Implements(Comparator)
export class OrderComparator implements Comparator<Object> {
	static readonly INSTANCE = new OrderComparator()

  compare(o1: Object, o2: Object): number {
    return this.doCompare(o1, o2)
  }

  private doCompare(o1: Object | undefined, o2: Object | undefined, sourceProvider?: OrderSourceProvider) {
		const p1 = Class.isImplements<PriorityOrdered>(o1, PriorityOrdered)
		const p2 = Class.isImplements<PriorityOrdered>(o2, PriorityOrdered)
		if (p1 && !p2) {
			return -1
		}
		else if (p2 && !p1) {
			return 1
		}

		const i1 = this.$getOrder(o1, sourceProvider)
		const i2 = this.$getOrder(o2, sourceProvider)
    return i1 == i2
      ? 0
      : (i1 > i2 ? 1 : -1)
  }

  private $getOrder(obj: Object | undefined, sourceProvider: OrderSourceProvider | undefined) : number {
		let order
		if (obj != undefined && sourceProvider != undefined) {
			const orderSource = sourceProvider.getOrderSource(obj)
			if (orderSource != undefined) {
				if (Array.isArray(orderSource)) {
					const sources = orderSource
					for (const source of sources) {
						order = this.findOrder(source)
						if (order != undefined) {
							break
						}
					}
				}
				else {
					order = this.findOrder(orderSource)
				}
			}
		}
		return (order != undefined ? order : this.getOrder(obj))
	}

	protected getOrder(obj: Object | undefined) {
		if (obj != undefined) {
			const order = this.findOrder(obj)
			if (order != undefined) {
				return order
			}
		}
		return Ordered.LOWEST_PRECEDENCE
	}

  protected findOrder(obj: Object): number | undefined {
		return Class.isImplements<Ordered>(obj, Ordered) ? obj.getOrder() : undefined
	}
}

export module OrderComparator {
  export interface OrderSourceProvider {
    getOrderSource(obj: Object): Object | undefined
	}
	export const OrderSourceProvider = new Interface('OrderSourceProvider')
}
