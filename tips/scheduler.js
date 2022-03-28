let activeEffect = void 0
const bucket = new WeakMap()
const effectStack = []

function cleanup() {}

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = activeEffect(effectStack.length - 1)
  }
  effectFn.options = options
  effectFn.deps = []
  effectFn()
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = deps.get(key)
  const effectToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) effectToRun.add(effectFn)
  })
  effectToRun.forEach(effectFn => {
    // 如果一个副作用函数存在调度器，则调用调度器，并将该副作用函数
    // 作为参数传递
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

// 定义一个任务队列
const jobQuene = new Set()
const p = Promise.resolve()

// 一个标志代表是否正在刷新队列
let isFlushing = false

function flushJob() {
  if (isFlushing) return
  isFlushing = true
  p.then(() => {
    jobQuene.forEach(job => job())
  }).finally(() => {
    isFlushing = false
  })
}