import { ITERATE_KEY, effect, computed, watch, track, trigger } from './effect.js'

function createReactive(data, isShallow = false, isReadonly = false) {
  return new Proxy(data, {
    get(target, key, receiver) {
      // 代理对象的raw属性可以读取原始属性
      // child.raw = obj parent.raw = proto
      if (key === 'raw') {
        return target
      }
      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key)
      }
      track(target, key)
      const res = Reflect.get(target, key, receiver)
      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res)
      }

      return res
    },
    set(target, key, newValue, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      // target是原对象, 当自身对象不存在属性时, 会遍历原型链
      // receiver是代理对象
      const oldValue = target[key]
      // 判断for...in循环是否修改了值
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? 'SET'
          : 'ADD'
        : Object.prototype.hasOwnProperty.call(target, key)
        ? 'SET'
        : 'ADD'
      const res = Reflect.set(target, key, newValue, receiver)
      if (target === receiver.raw) {
        if (newValue !== oldValue) {
          trigger(target, key, type, newValue)
        }
      }
      return res
    },
    has(target, key, receiver) {
      track(target, key)
      return Reflect.has(target, key, receiver)
    },
    ownKeys(target) {
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const res = Reflect.defineProperty(target, key)
      if (res) {
        trigger(target, key)
      }
      return res
    }
  })
}

export function reactive(obj) {
  return createReactive(obj)
}

export function shallowReactive(obj) {
  return createReactive(obj, true)
}

function readonly(obj) {
  return createReactive(obj, false, true)
}

export function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}

export function ref(val) {
  const wrapper = {
    value: val
  }
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return reactive(wrapper)
}

function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    set value(val) {
      obj[key] = val
    }
  }
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  return wrapper
}

function toRefs(obj) {
  const res = {}
  for (let ket in obj) {
    res[key] = toRef(obj, key)
  }
  return res
}

function isRef(ref) {
  return !!ref.__v_isRef
}

function unref(ref) {
  return isRef(ref) ? ref.value : ref
}

function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      return unref(value)
    },
    set(target, key, newValue, receiver) {
      const value = target[key]
      if (isRef(value)) {
        value.value = newValue
        return true
      }
      return Reflect.set(target, key, newValue, receiver)
    }
  })
}
