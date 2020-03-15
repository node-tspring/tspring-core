import { EnumerablePropertySource } from './EnumerablePropertySource'

export class MapPropertySource extends EnumerablePropertySource<Map<string, Object>> {
	constructor(name: string , source: Map<string, Object> ) {
		super(name, source)
	}

	getProperty(name: string): Object | undefined {
		return this.source.get(name)
	}

	containsProperty(name: string) {
		return this.source.has(name)
	}

	getPropertyNames(): string[] {
		return Array.from(this.source.keys())
	}

}
