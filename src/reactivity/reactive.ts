// import { track, trigger } from './demo'

import { mutableHandlers, readonlyHandlers, shllowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = 'is_reactive',
  IS_READONLY = 'is_readonly'
}

function createActiveObject(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

// export function shallowReactive(raw) {
//   return createActiveObject(raw, shallowReactiveHanlers)
// }

export function shallowReadonly(raw) {
  return createActiveObject(raw, shllowReadonlyHandlers)
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
