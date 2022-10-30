import { h } from '../lib/guide-mini-vue-esm.js'

export const Foo = {
  name: 'Foo',
  // readonly
  setup(props) {
    console.log('props', props)
  },
  render() {
    return h('div', {}, 'foo: ' + this.count)
  }
}
