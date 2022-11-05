import { h, renderSlots, getCurrentInstance } from '../../lib/guide-mini-vue-esm.js'

export const Foo = {
  name: 'Foo',
  // readonly
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    console.log('instance: ', instance)

    const emitAdd = () => {
      emit('add-foo', 1, 2)
    }
    return {
      emitAdd
    }
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd
      },
      'emitAdd'
    )
    const foo = h('p', {}, 'foo')
    const age = 18
    // renderSlots
    // 1. 获取到渲染得元素
    // 2. 获取导渲染得位置
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age }),
      foo,
      btn,
      renderSlots(this.$slots, 'footer')
    ])
  }
}
