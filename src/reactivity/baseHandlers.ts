import { extend, isObject } from '../shared/index'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

// 初始化调用一次,之后使用缓存
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }
    // 判断res是否为object
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return true
  }
}

export const mutableHandlers = {
  get,
  set
}
// export const shllowMutableHandlers = {
//   get,
//   set
// }

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`key:${key}, set 失败 因为 target 是 readonly`, target)
    return true
  }
}
export const shllowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
