import { ReactiveEffect } from './effect'

// 通过 options.scheduler 实现
class ComputedImp {
  private _dirty: boolean = true
  private _value: any
  private _effect: ReactiveEffect

  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    // 当依赖的响应式对象的值发生改变 -> dirty = true
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedImp(getter)
}
