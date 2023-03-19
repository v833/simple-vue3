import { createRenderer, renderOptions } from './compiler.js'

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

// function renderDemo() {}
const renderer = createRenderer(renderOptions)
const vnode = {
  type: 'div',
  props: { id: 'foo' },
  children: [
    {
      type: 'p',
      props: {
        class: 'p'
      },
      children: 'hello'
    },
    {
      type: 'button',
      props: {
        onClick: [
          () => {
            console.log('click')
          },
          () => {
            console.log('click2')
          }
        ]
      },
      children: 'click'
    }
  ]
}
// app._vnode 判断新增还是更新
renderer.render(vnode, app)
