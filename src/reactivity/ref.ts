import { hasChanged, isObject } from '../shared'
import { isTraking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImp {
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef = true

  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (!hasChanged(newValue, this._rawValue)) return
    this._rawValue = newValue
    this._value = convert(newValue)

    triggerEffects(this.dep)
  }
}
export function ref(value) {
  return new RefImp(value)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

// unref()：是 val = isRef(val) ? val.value : val 的语法糖。
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

// template 中ref省略.value
export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}

function trackRefValue(ref) {
  if (isTraking()) {
    trackEffects(ref.dep)
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}
