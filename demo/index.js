import { createRenderer, renderOptions } from './runtime.js'

function reactiveDemo() {
  // const data = { ok: true, text: 'hello world', foo: 1, bar: 2, deep: { a: 1 } }
  // const obj = reactive(data)
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
  // const arr = reactive(['foo'])
  // effect(() => {
  //   console.log(arr[0])
  //   console.log('length', arr.length)
  // })
  // arr.length = 0
  // const arr = reactive([1, 2])
  // effect(() => {
  //   console.log(arr.includes(1))
  // })
  // arr[0] = 3
  // TODO ref
  // const refVal = ref(1)
  // effect(() => {
  //   console.log(refVal.value)
  // })
  // refVal.value = 2
}

function createVNode(keyList) {
  return keyList.reduce((arr, item) => {
    arr.push({
      type: 'p',
      key: String(item),
      children: String(item)
    })
    return arr
  }, [])
}

const renderer = createRenderer(renderOptions)
// const vnode1 = {
//   type: 'div',
//   children: createVNode([1, 2, 3, 4, 6, 5])
// }
// const vnode2 = {
//   type: 'div',
//   children: createVNode([1, 3, 4, 2, 7, 5])
// }
// app._vnode 判断新增还是更新

const MyComponent = {
  name: 'App',
  data() {
    return {
      foo: 'hello'
    }
  },
  props: {
    title: String
  },
  render() {
    return {
      type: 'div',
      children: this.title
    }
  }
}

const App = {
  name: 'App',
  type: MyComponent,
  props: {
    title: 'my title'
    // other: this.val
  },
  children: []
}

renderer.render(App, document.getElementById('app'))

// setTimeout(() => {
//   renderer.render(vnode2, app)
// }, 1500)
