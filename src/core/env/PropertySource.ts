export abstract class PropertySource<T> {
  protected source: T

  abstract getProperty(name: string): Object | undefined

  constructor(name: string)
  constructor(name: string, source: T)

  constructor(protected name: string, source?: T) {
    this.source = source || {} as T
  }

  getName(): string {
		return this.name
  }

  getSource() {
		return this.source
	}
}

export module PropertySource {
  export class StubPropertySource extends PropertySource<Object> {

		constructor(name: string) {
			super(name, new Object())
		}

		getProperty(name: string): string | undefined {
			return undefined
		}
	}
}
