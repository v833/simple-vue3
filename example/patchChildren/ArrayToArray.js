import { h, ref } from '../../lib/guide-mini-vue-esm.js'

function createVNode(keyList) {
  return keyList.map((item) => {
    return h('div', { key: item }, item)
  })
}

// 1. 左端对比
// const prevChildren = createVNode(['A', 'B', 'C'])
// const nextChidren = createVNode(['A', 'B', 'D', 'E'])

// 2. 右侧对比
// const prevChildren = createVNode(['A', 'B', 'C'])
// const nextChidren = createVNode(['D', 'E', 'B', 'C'])

// 3. 新的比老的长
// const prevChildren = createVNode(['A', 'B'])
// const nextChidren = createVNode(['A', 'B', 'C', 'D'])

// const prevChildren = createVNode(['A', 'B'])
// const nextChidren = createVNode(['C', 'D', 'A', 'B'])

// 老的比新的长
const prevChildren = createVNode(['A', 'B', 'C', 'D'])
const nextChidren = createVNode(['A', 'B'])

export default {
  name: 'ArrayToArray',
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
