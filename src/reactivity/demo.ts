class ReactiveEffect {
  private _fn: any
  // public 将参数传递出去
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
}
const targetMap = new WeakMap()

export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(activeEffect)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  deps.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

let activeEffect
export function effect(fn, options: any = {}) {
  const scheduler = options.scheduler

  const _effect = new ReactiveEffect(fn, scheduler)
  // _effect.run()
  return _effect.run.bind(_effect)
}
