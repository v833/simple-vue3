import { h } from '../../lib/guide-mini-vue-esm.js'

export const App = {
  name: 'App',
  setup() {},

  // parser -> ast -> transform -> ast -> codegen -> render
  template: `<div>Consumer: xxx</div>`,
  render() {
    return h('div', {}, 'compile')
  }
}
