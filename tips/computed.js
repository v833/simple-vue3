// 懒执行的effect 
// 不需要立即执行，在需要的时候执行

let activeEffect = void 0
const bucket = new WeakMap()
const effectStack = []

function cleanup() {}

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(activeEffect)
    const res = fn()
    effectStack.pop()
    activeEffect = activeEffect[activeEffect.length - 1]
    return res
  }
  effectFn.options = options
  effectFn.deps = []
  if (!options.lazy) effectFn()
  return effectFn
}

function computed(getter) {
  let value
  let dirty = true
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true
    }
  })
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      return value
    }
  }
  return obj
}


const effectFn = effect(() => {
  // console.log(1);
  // getter obj.foo + obj.bar
}, {
  lazy: true
})

const value = effectFn() // 手动执行