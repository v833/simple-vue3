import { h, ref } from '../../lib/guide-mini-vue-esm.js'

function createVNode(keyList) {
  return keyList.map((item) => {
    return h('p', { key: item }, item)
    // return h('p', {}, item)
  })
}

// 1. 左端对比
// const prevChildren = createVNode(['A', 'B', 'C'])
// const nextChildren = createVNode(['A', 'B', 'D', 'E'])

// 2. 右侧对比
// const prevChildren = createVNode(['A', 'B', 'C'])
// const nextChildren = createVNode(['D', 'E', 'B', 'C'])

// 3. 新的比老的长
// const prevChildren = createVNode(['A', 'B'])
// const nextChildren = createVNode(['A', 'B', 'C', 'D'])

// const prevChildren = createVNode(['A', 'B'])
// const nextChildren = createVNode(['C', 'D', 'A', 'B'])

// 老的比新的长
// const prevChildren = createVNode(['A', 'B', 'C', 'D'])
// const nextChildren = createVNode(['A', 'B'])

//
// const prevChildren = createVNode(['A', 'B', 'C', 'D', 'F', 'G'])
// const nextChildren = createVNode(['A', 'B', 'E', 'C', 'F', 'G'])

// const prevChildren = createVNode(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
// const nextChildren = createVNode(['A', 'B', 'E', 'C', 'D', 'F', 'G'])

const prevChildren = createVNode(['A', 'B', 'C', 'D', 'W', 'Q', 'N', 'E', 'Z', 'F', 'G'])
const nextChildren = createVNode(['A', 'B', 'Q', 'D', 'C', 'Y', 'E', 'G', 'F'])

// const prevChildren = createVNode(['A', 'C', 'B', 'D'])
// const nextChildren = createVNode(['A', 'B', 'C', 'D'])

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
    return self.isChange === true ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  }
}
