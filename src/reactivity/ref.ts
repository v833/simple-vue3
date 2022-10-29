import { hasChanged, isObject } from '../shared'
import { isTraking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImp {
  private _value: any
  public dep
  private _rawValue: any
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

function trackRefValue(ref) {
  if (isTraking()) {
    trackEffects(ref.dep)
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}
