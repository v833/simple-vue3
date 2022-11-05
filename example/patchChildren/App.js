import { h } from '../../lib/guide-mini-vue-esm.js'
import ArrayToArray from './ArrayToArray.js'
import ArrayToText from './ArrayToText.js'
import TextToArray from './TextToArray.js'
import TextToText from './TextToText.js'

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // 老的是array, 新的是text
      // h(ArrayToText),
      // h(ArrayToArray)
      h(TextToArray)
      // h(TextToText)
    ])
  }
}
