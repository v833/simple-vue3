const reactiveMap = new WeakMap()

const createReactiveObject = (target, proxyMap, baseHandles) => {
  // 创建Proxy对象 使用缓存，命中直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) return existingProxy
  const proxy = new Proxy(target, baseHandles)
  proxyMap.set(target, proxy)
  return proxy
}

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target, key, receiver) {
    // { foo:1 } foo -> 1
    const res = Reflect.get(target, key, receiver)
    // 触发get时，进行依赖收集
    track(target, 'get', key)
    return res
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    // 触发set时，进行触发依赖
    trigger(target, 'set', key)
    return result
  }
}

function trigger() {}
function track() {}
