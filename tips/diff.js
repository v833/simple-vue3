function patchElement(n1, n2) {
  const el = n2.el = n1.el
}

function patchChildren(n1, n2, container) {
  if (typeof n2.children === 'string') {

  } else if (Array.isArray(n2.children)) {
    const oldChildren = n1.children
    const newChildren = n2.children
    let lastIndex = 0
    let find = false
    for (let i = 0; i < newChildren.length; i++) {
      const newNode = newChildren[i]
      for (let j = 0; i < oldChildren; i++) {
        const oldNode = oldChildren[j]
        if (oldNode.key === newNode.key) {
          find = true
          patch(oldNode, newNode, container)
          if (j < lastIndex) {
            const prevNode = newChildren[i - 1]
            if (prevNode) {
              const anchor = prevNode.el.nextSibling
              insert(newNode.el, container, anchor)
            }
            // 真实DOM需要移动
          } else {
            lastIndex = j
          }
          break
        }
        // 运行到这里说明newNode为新增节点
        if (!find) {
          const prevNode = newChildren[i - 1]
          let anchor = null
          if (prevNode) {
            anchor = prevNode.el.nextSibling
          } else {
            anchor = container.firstChild
          }
          patch(null, newNode, container, anchor)
        }
      }
    }

    // 删除无用的节点
    for (let i = 0; i < oldChildren.length; i++) {
      const oldNode = oldChildren[i]
      const has = newChildren.find(node => node.key === oldNode.key)
      if (!has) {
        unmount(oldNode)
      }
    }
  } else {}
}