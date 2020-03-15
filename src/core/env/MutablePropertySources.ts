import { PropertySources } from './PropertySources'
import { PropertySource } from './PropertySource'
import { IllegalArgumentException } from '../../lang/exception/IllegalArgumentException'
import { Implements } from '../../lang/type/Interface'

@Implements(PropertySources)
export class MutablePropertySources implements PropertySources {

  private propertySourceList: PropertySource<Object>[] = []

  ;[Symbol.iterator](): Iterator<PropertySource<Object>> {
    return this.propertySourceList[Symbol.iterator]()
  }

  addLast(propertySource: PropertySource<Object>) {
		this.removeIfPresent(propertySource)
		this.propertySourceList.push(propertySource)
  }

  addFirst(propertySource: PropertySource<Object>) {
		this.removeIfPresent(propertySource)
		this.propertySourceList.unshift(propertySource)
  }

  addBefore(relativePropertySourceName: string, propertySource: PropertySource<Object>) {
		this.assertLegalRelativeAddition(relativePropertySourceName, propertySource)
		this.removeIfPresent(propertySource)
		const index = this.assertPresentAndGetIndex(relativePropertySourceName)
		this.addAtIndex(index, propertySource)
  }

  addAfter(relativePropertySourceName: string, propertySource: PropertySource<Object>) {
		this.assertLegalRelativeAddition(relativePropertySourceName, propertySource)
		this.removeIfPresent(propertySource)
		const index = this.assertPresentAndGetIndex(relativePropertySourceName)
		this.addAtIndex(index + 1, propertySource)
  }

  private getIndex(name: string) {
    for (let i=0; i<this.propertySourceList.length; i++) {
      if (this.propertySourceList[i].getName() == name) {
        return i
      }
    }
    return -1
  }

  protected assertLegalRelativeAddition(relativePropertySourceName: string, propertySource: PropertySource<Object>) {
		const newPropertySourceName = propertySource.getName()
		if (relativePropertySourceName == newPropertySourceName) {
			throw new IllegalArgumentException(`PropertySource named '${newPropertySourceName}' cannot be added relative to itself`)
		}
  }

  private assertPresentAndGetIndex(name: string) {
		const index = this.getIndex(name)
		if (index == -1) {
			throw new IllegalArgumentException(`PropertySource named '${name}' does not exist`)
		}
		return index
	}

  private addAtIndex(index: number, propertySource: PropertySource<Object>) {
		this.removeIfPresent(propertySource)
		this.propertySourceList.splice(index, 0, propertySource)
	}

  contains(name: string): boolean {
		return this.get(name) != undefined
  }

  get(name: string): PropertySource<Object> | undefined {
    for (const propertySource of this.propertySourceList) {
      if (propertySource.getName() == name) {
        return propertySource
      }
    }
    return undefined
  }

  remove(name: string): PropertySource<Object> | undefined {
    let removedPropertySource: PropertySource<Object> | undefined
    this.propertySourceList.forEach((propertySource, index) => {
      if (propertySource.getName() == name) {
        this.propertySourceList.splice(index, 1)
        return removedPropertySource
      }
    })
		return removedPropertySource
  }

  replace(name: string, propertySource: PropertySource<Object>) {
    this.propertySourceList.forEach((propertySource, index) => {
      if (propertySource.getName() == name) {
        this.propertySourceList[index] = propertySource
      }
    })
	}

  protected removeIfPresent(propertySource: PropertySource<Object>) {
    this.propertySourceList.forEach((item, index) => {
      if (item == propertySource) {
        this.propertySourceList.splice(index, 1)
      }
    })
	}
}
