import { h, ref } from '../../lib/guide-mini-vue-esm.js'

const nextChidren = 'nextChildren'
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]

export default {
  name: 'ArrayToText',
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
