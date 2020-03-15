export class Properties extends Map<Object,Object> {
  protected defaults?: Properties

  getProperty(key: string, defaultValue?: string): string | undefined {
    const oval = super.get(key)
    const sval = typeof oval == 'string' ? oval : undefined
    const val = ((sval == undefined) && (this.defaults != undefined)) ? this.defaults.getProperty(key) : sval
    return val == undefined ? defaultValue : val
  }
}
