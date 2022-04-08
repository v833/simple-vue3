function patchChilden(n1, n2, container) {
  if (typeof n2.children === 'string') {

  } else if (Array.idArray(n2.children)) {
    patchKeyedChildren(n1, n2, container)
  } else {}
}

function patchKeyedChildren(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children

  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1

  let oldStartVnode = oldChildren[oldStartIdx]
  let oldEndVnode = oldChildren[oldEndIdx]
  let newStartVnode = newChildren[newStartIdx]
  let newEndVnode = newChildren[newEndIdx]

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx]
    } else if (oldStartVnode.key === newStartVnode.key) {
      patch(oldEndVnode, newEndVnode, container)
      oldStartVnode = oldChildren[++olStartIdx]
      newEndVnode = newChildren[--newEndIdx]
    } else if (oldEndVnode.key === newEndVnode.key) {
      patch(oldEndVnode, newEndVnode, container)
      oldEndVnode = oldChildren[--oldEndIdx]
      newEndVnode = newChildren[--newEndIdx]
    } else if (oldStartVnode.key === newEndVnode.key) {
      patch(oldEndVnode, newEndVnode, container)
      insert(oldStartVnode.el, container, oldEndVnode.el.nextSibling)
    } else if (oldEndVnode.key === newStartVnode.key) {
      patch(oldEndVnode, newStartVnode, container)
      insert(oldEndVnode.el, container, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIdx]
      newStartVnode = newChildren[++newStartIdx]
    } else {
      // 遍历旧的children，试图寻找与newStartVnode拥有相同key的元素
      const idxInOld = oldChildren.findIndex(node => {
        return node.key === newStartVnode.key
      })
      if (idxInOld > 0) {
        const vnodeToMove = oldChildren[idxInOld]
        patch(vnodeToMove, newStartVnode, container)
        insert(vnodeToMove.el, container, oldStartVnode.el)
        oldChildren[idxInOld] = void 0
      } else {
        // 将newStartVnode作为新节点挂载到头部，使用当前头部节点oldStartVnode.el作为锚点
        patch(null, newStartVnode, container, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIdx]
    }
  }
}