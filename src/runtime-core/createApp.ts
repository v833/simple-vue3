import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先 vnode
      // componnet -> vnode
      // 后续所有操作基于vnode做处理
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer, null)
    }
  }
}
