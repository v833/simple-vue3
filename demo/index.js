import { ITERATE_KEY, effect, computed, watch, track, trigger } from './reactivity.js'
// import { effect, track, trigger } from './note.js'

const data = { ok: true, text: 'hello world', foo: 1, bar: 2 }

const obj = new Proxy(data, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    // 判断for...in循环是否修改了值
    const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key, type)
    return res
  },
  has(target, key, receiver) {
    track(target, key)
    return Reflect.has(target, key, receiver)
  },
  ownKeys(target) {
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  }
})

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

// TODO watch
watch(
  () => obj.foo,
  async (newValue, oldValue, onInvalidate) => {
    console.log('changed', newValue, oldValue)
    let expired = false
    onInvalidate(() => {
      expired = true
    })
  },
  {
    immediate: true
  }
)

// obj.foo++
// obj.foo++
