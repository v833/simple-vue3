import { extend } from '../shared'

let activeEffect
// 解决 stop prop++ 触发了get和set 使stop失效
let shouldTrack

class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  // public 将参数传递出去
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false

    return result
  }
  stop() {
    if (this.active) {
      this.onStop?.()
      cleanupEffect(this)
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new WeakMap()

export function track(target, key) {
  if (!isTraking()) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}

export function isTraking() {
  return shouldTrack && activeEffect
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  // 反向收集
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return

  triggerEffects(deps)
}

export function triggerEffects(deps) {
  deps.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  // extend
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
