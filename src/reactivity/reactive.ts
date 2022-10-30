// import { track, trigger } from './demo'

import { isObject } from '../shared/index'
import { mutableHandlers, readonlyHandlers, shllowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = 'is_reactive',
  IS_READONLY = 'is_readonly'
}

function createReactiveObject(target: any, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须为对象`)
    return
  }
  return new Proxy(target, baseHandlers)
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers)
}

// export function shallowReactive(raw) {
//   return createActiveObject(raw, shallowReactiveHanlers)
// }

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shllowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}
