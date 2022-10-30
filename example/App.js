import { h } from '../lib/guide-mini-vue-esm.js'
import { Foo } from './foo.js'
window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        }
      },
      // setupState
      // this.$el
      [h('div', {}, 'hi ' + this.msg), h(Foo, { count: 1 })]
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'vue')]
    )
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}
