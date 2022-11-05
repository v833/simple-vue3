import { h, ref } from '../../lib/guide-mini-vue-esm.js'

const nextChidren = [h('div', {}, 'A'), h('div', {}, 'B')]
const prevChildren = 'prevChildren'

export default {
  name: 'TextToArray',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },
  render() {
    const self = this
    return self.isChange === true ? h('div', {}, nextChidren) : h('div', {}, prevChildren)
  }
}
