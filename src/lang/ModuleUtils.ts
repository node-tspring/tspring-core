import fs from 'fs'
import path from 'path'

const basePath = path.resolve('.') + path.sep
const baseNodeModulesPath = path.join(basePath, 'node_modules') + path.sep

function findInChildren(target: any, children: NodeModule[], visited: Set<string>): NodeModule | undefined {
  for (const m of children) {
    if (visited.has(m.id)) continue
    visited.add(m.id)
    if (m.exports == target) {
      return m
    }
    else {
      for (const key in m.exports) {
        const descriptor = Object.getOwnPropertyDescriptor(m.exports, key)
        if (descriptor && descriptor.value == target) {
          return m
        }
        const result = findInChildren(target, m.children, visited)
        if (result != undefined) return result
      }
    }
  }
  return undefined
}

const cache = {
  moduleId: new Map<Object, string>(),
  simpleId: new Map<Object, string>(),
  module: new Map<string, Object>(),
  packageName: new Map<Object, string>(),
  packagePath: new Map<Object, string>()
}

export abstract class ModuleUtils {

  static fromModuleId (id: string | undefined) {
    if (id == undefined) return undefined
    let result = cache.module.get(id)
    if (result != undefined) {
      return result
    }
    let [filePath, name] = id.split(':')
    let nodeModule
    if (filePath.startsWith('~/')) {
      filePath = basePath + filePath.substr(2)
    }
    else {
      nodeModule = require.cache[filePath]
      if (nodeModule == undefined) {
        filePath = require.resolve(filePath)
        nodeModule = require.cache[filePath]
      }
    }
    const m = nodeModule == undefined
      ? require(filePath)
      : nodeModule.exports
    result = name == undefined ? m : m[name]
    if (result == undefined) {
      throw new Error(`Module(name=${name}, id=${id}) not found.`)
    }
    cache.module.set(id, result)
    return result
  }

  static getModuleId (id: string): string
  static getModuleId (obj: Object): string
  static getModuleId (arg1: any): string {
    let result = cache.moduleId.get(arg1)
    if (result != undefined) {
      return result
    }
    if (typeof arg1 == 'string') {
      let [key, name] = arg1.split(':')
      let nodeModule = require.cache[key]
      if (nodeModule == undefined) {
        key = require.resolve(key)
        nodeModule = require.cache[key]
      }
      const m = nodeModule == undefined
        ? require(key)
        : nodeModule.exports
      const obj = name == undefined ? m : m[name]
      if (obj == undefined) {
        throw new Error(`id: ${arg1} can‘t covert to a module id.`)
      }
      result = name == undefined ? key : `${key}:${name}`
      cache.moduleId.set(arg1, result)
      return result
    } else {
      const clazz = arg1
      const visited = new Set<string>()
      for (const id in require.cache) {
        const m = require.cache[id]
        visited.add(id)
        if (m.exports == clazz) {
          if (findInChildren(clazz, m.children, visited) == undefined) {
            result = m.id
            cache.moduleId.set(arg1, result)
            return result
          }
        }
        else {
          for (const key in m.exports) {
            const descriptor = Object.getOwnPropertyDescriptor(m.exports, key)
            if (descriptor && descriptor.value == clazz) {
              if (findInChildren(clazz, m.children, visited) == undefined) {
                result = `${m.id}:${key}`
                cache.moduleId.set(arg1, result)
                return result
              }
            }
          }
        }
      }
      throw new Error(`obj: ${arg1} can‘t covert to a module id.`)
    }
  }

  private static $getPackageName (obj: any, withName = false) {
    const moduleId = ModuleUtils.getModuleId(obj)
    let packageName: string | undefined
    let [filePath, name] = moduleId.split(':')
    let packagePath: string

    if (filePath.startsWith(basePath) && !filePath.startsWith(baseNodeModulesPath)) {
      console.log('tag', filePath, name)
      packageName = '~/' + path.relative(basePath, filePath).replace(/\.(t|j)s$/i, '')
      packagePath = basePath
    }
    else {
      let packageJsonPath
      let lastPath
      let hasPackageJson
      while(true) {
        packageJsonPath = path.join(filePath, 'package.json')
        hasPackageJson = fs.existsSync(packageJsonPath)
        if (hasPackageJson || lastPath == packageJsonPath) {
          try {
            packageName = require(packageJsonPath).name
            break
          } catch {}
        }
        lastPath = packageJsonPath
        filePath = path.resolve(path.join(filePath, '..'))
      }
      packagePath = filePath
      if (packageName == undefined) {
        throw new Error(`can't parse packageName for obj ${obj}`)
      }
    }

    if (withName && name != undefined) {
      packageName += `:${name}`
    }

    return { packageName, packagePath }
  }

  static getPackagePath (obj: any): string {
    let result = cache.packagePath.get(obj)
    if (result != undefined) return result
    result = ModuleUtils.$getPackageName(obj, false).packagePath
    cache.packagePath.set(obj, result)
    return result
  }

  static getPackageName (obj: any): string {
    let result = cache.packageName.get(obj)
    if (result != undefined) return result
    result = ModuleUtils.$getPackageName(obj, false).packageName
    cache.packageName.set(obj, result)
    return result
  }

  static getSimpleModuleId (obj: any): string {
    let result = cache.simpleId.get(obj)
    if (result != undefined) return result
    result = ModuleUtils.$getPackageName(obj, true).packageName
    cache.simpleId.set(obj, result)
    return result
  }
}
