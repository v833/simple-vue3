const bucket = new WeakMap()
export const ITERATE_KEY = Symbol()
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

export function trigger(target, key, type) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  // 只有操作类型为'ADD'时, 才触发与ITERATE_KEY相关联的副作用函数1重新执行
  if (type === 'ADD') {
    const iterateEffects = target.get(ITERATE_KEY)
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn)
        }
      })
  }
  effectsToRun.forEach((effectFn) => {
    const { scheduler } = effectFn.options
    if (scheduler) {
      scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

export function effect(fn, options = {}) {
  // activeEffect = fn
  // fn()
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack.at(-1)
    return res
  }
  effectFn.options = options
  effectFn.deps = []
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}

export const computed = (getter) => {
  let value
  let dirty = true
  const effectFn = effect(getter, {
    scheduler() {
      dirty = true
      trigger(obj, 'value')
    },
    lazy: true
  })
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      track(obj, 'value')
      return value
    }
  }
  return obj
}

export const watch = (source, cb, options = {}) => {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  let newValue, oldValue
  let cleanup

  const onInvalidate = (fn) => {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    if (cleanup) {
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      // post asyc pre
      if (options.flush === 'post') {
        const p = Promise.then()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}
