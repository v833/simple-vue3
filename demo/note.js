const bucket = new WeakMap()
let activeEffect
const effectStack = []

function cleanup(effectFn) {
  const { deps } = effectFn
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effectFn)
  }
  deps.length = 0
}

export function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  if (!effects) return
  const effectsToRun = new Set()
  effects.forEach((effectFn) => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })

  effectsToRun.forEach((effectFn) => effectFn())
}

export function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack.at(-1)
  }
  effectFn.deps = []
  effectFn()
}
