import { h } from '../lib/guide-mini-vue-esm.js'

export const Foo = {
  name: 'Foo',
  // readonly
  setup(props, { emit }) {
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
    return h('div', {}, [foo, btn])
  }
}
