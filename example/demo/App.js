import { createTextVNode, getCurrentInstance, h } from '../../lib/guide-mini-vue-esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this
    const slot = {
      header: ({ age }) => [h('p', {}, 'slot.p1' + age), createTextVNode('hello')],
      footer: () => h('p', {}, 'slot.p2')
    }
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard']
        // onClick() {
        //   console.log('click')
        // }
      },
      // setupState
      // this.$el
      [
        h('div', {}, 'hi ' + this.msg),
        h(
          Foo,
          {
            count: 1,
            onAddFoo(a, b) {
              console.log('on-add-foo', a, b)
            }
          },
          slot
        )
      ]
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'vue')]
    )
  },
  setup() {
    const instance = getCurrentInstance()
    return {
      msg: 'mini-vue'
    }
  }
}
