import { ITERATE_KEY, effect, computed, watch, track, trigger } from './reactivity.js'
// import { effect, track, trigger } from './note.js'

const data = { ok: true, text: 'hello world', foo: 1, bar: 2, deep: { a: 1 } }

function createReactive(data, isShallow = false, isReadonly = false) {
  return new Proxy(data, {
    get(target, key, receiver) {
      // 代理对象的raw属性可以读取原始属性
      // child.raw = obj parent.raw = proto
      if (key === 'raw') {
        return target
      }
      if (!isReadonly) {
        track(target, key)
      }
      track(target, key)
      const res = Reflect.get(target, key, receiver)
      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res)
      }

      return res
    },
    set(target, key, value, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      // target是原对象, 当自身对象不存在属性时, 会遍历原型链
      // receiver是代理对象
      const oldValue = target[key]
      // 判断for...in循环是否修改了值
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      const res = Reflect.set(target, key, value, receiver)
      if (target === receiver.raw) {
        if (value !== oldValue) {
          trigger(target, key, type)
        }
      }
      return res
    },
    has(target, key, receiver) {
      track(target, key)
      return Reflect.has(target, key, receiver)
    },
    ownKeys(target) {
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      const res = Reflect.defineProperty(target, key)
      if (res) {
        trigger(target, key)
      }
      return res
    }
  })
}

function reactive(obj) {
  return createReactive(obj)
}

function shallowReactive(obj) {
  return createReactive(obj, true)
}

function readonly(obj) {
  return createReactive(obj, false, true)
}

function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}

const obj = reactive(data)
// TODO 1 happypath
// effect(() => {
//   console.log('effect run')
//   document.body.innerHTML = obj.ok ? obj.text : 'not'
// })

// setTimeout(() => {
//   obj.ok = false
//   obj.text = 'tt'
// }, 1000)

// TODO 2 scheduler
// effect(
//   () => {
//     console.log(obj.foo)
//   },
//   {
//     scheduler(fn) {
//       setTimeout(fn)
//     }
//   }
// )
// obj.foo++
// obj.foo++
// console.log('finished')

// TODO 3 computed
// const value = computed(() => {
//   return obj.foo + obj.bar
// })
// console.log(value.value)
// console.log(value.value)
// obj.foo++
// console.log(value.value)

// TODO 4 watch
// watch(
//   () => obj.foo,
//   async (newValue, oldValue, onInvalidate) => {
//     console.log('changed', newValue, oldValue)
//     let expired = false
//     onInvalidate(() => {
//       expired = true
//     })
//   },
//   {
//     immediate: true
//   }
// )

// obj.foo++
// obj.foo++

// TODO 5 readonly
// const readonlyObj = readonly({ foo: 1 })
// readonlyObj.foo = 2

// TODO Array
