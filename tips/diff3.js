function patchKeyedChildren(n1, n2, container) {
  const newChildren = n2.children
  const oldChildren = n1.children

  let j = 0
  let oldVnode = oldChildren[j]
  let newVnode = newChildren[j]
  while (oldVnode.key === newVnode.key) {
    patch(oldVnode, newVnode, container)
    j++
    oldVnode = oldChildren[j]
    newVnode = newChildren[j]
  }
  let oldEnd = oldChildren.length - 1
  let newEnd = newChildren.length - 1

  oldVnode = oldChildren[oldEnd]
  newVnode = newChildren[newEnd]
  while (oldVnode.key === newVnode.key) {
    patch(oldVnode, newVnode, container)
    oldEnd--
    newEnd--
    oldValue = oldChildren[oldEnd]
    newValue = newChildren[newEnd]
  }
}