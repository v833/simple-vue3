const TEXT = Symbol()
const COMMENT = Symbol()
const FRAGMENT = Symbol()

export function createRenderer(options = {}) {
  const {
    createElement,
    insert,
    unmount,
    setElementText,
    patchProps,
    createText,
    setText,
    createComment,
    setComment
  } = options

  function patch(n1, n2, container, anchor) {
    // 当vnode的type不同时, 卸载旧vnode
    if (n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }
    const type = typeof n2.type
    switch (type) {
      case FRAGMENT:
        if (!n1) {
          n2.children.forEach((c) => patch(null, c, container))
        } else {
          patchChildren(n1, n2, children)
        }
        break
      case 'string':
        if (!n1) {
          // 新增
          mountElement(n2, container, anchor)
        } else {
          // 更新
          patchElement(n1, n2)
        }
        break
      case TEXT:
        if (!n1) {
          const el = (n2.el = createText(n2.children))
          insert(el, container)
        } else {
          const el = (n2.el = n1.el)
          if (n2.children !== n1.children) {
            setText(el, n2.children)
          }
        }
        break
      case COMMENT:
        if (!n1) {
          const el = (n2.el = createComment(n2.children))
          insert(el, container)
        } else {
          const el = (n2.el = n1.el)
          if (n2.children !== n1.children) {
            setComment(el, n2.children)
          }
        }
        break
      case 'object':
        break
    }
  }
  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else {
      // 卸载
      if (container._vnode) {
        // container.innerHTML = ''
        unmount(container._vnode)
      }
    }
    container._vnode = vnode
  }
  // function hydrate(vnode, container) { }

  function mountElement(vnode, container, anchor) {
    const el = (vnode.el = createElement(vnode.type))
    const { children, props } = vnode

    if (typeof children === 'string') {
      setElementText(el, children)
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        patch(null, child, el)
      })
    }
    if (props) {
      for (const key in props) {
        patchProps(el, key, null, props[key])
      }
    }
    insert(el, container, anchor)
  }
  function patchElement(n1, n2) {
    const el = (n2.el = n1.el)
    const oldProps = n1.props
    const newProps = n2.props
    // 更新props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null)
      }
    }
    // 更新children
    patchChildren(n1, n2, el)
  }
  function patchChildren(n1, n2, container) {
    if (typeof n2.children === 'string') {
      // 旧节点的类型有三种可能, 没有子节点, 文本节点以及一组子节点
      // 只有当旧节点为一组节点时, 才需要逐个卸载, 其他情况下什么都不需要做
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c))
      }
      setElementText(container, n2.children)
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        //TODO diff
        patchKeyedChildren(n1, n2, container)
      } else {
        setElementText(container, '')
        n2.children.forEach((c) => patch(null, c, container))
      }
    } else {
      // 代码运行到这里说明新子节点不存在
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c))
      } else if (typeof n1.children === 'string') {
        setElementText(container, '')
      }
    }
  }
  function patchKeyedChildren(n1, n2, container) {
    const oldChildren = n1.children
    const newChildren = n2.children
    // 四个索引值
    let oldStartIdx = 0
    let oldEndIdx = oldChildren.length - 1
    let newStartIdx = 0
    let newEndIdx = newChildren.length - 1

    let oldStartVNode = oldChildren[oldStartIdx]
    let oldEndVNode = oldChildren[oldEndIdx]
    let newStartVNode = newChildren[newStartIdx]
    let newEndVNode = newChildren[newEndIdx]

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (!oldStartVNode) {
        oldStartVNode = oldChildren[++oldStartIdx]
      } else if (!oldEndVNode) {
        oldEndVNode = oldChildren[--oldEndIdx]
      } else if (isSameKey(oldStartVNode, newStartVNode)) {
        patch(oldStartVNode, newStartVNode, container)
        oldStartVNode = oldChildren[++oldStartIdx]
        newStartVNode = newChildren[++newStartIdx]
      } else if (isSameKey(oldEndVNode, newEndVNode)) {
        patch(oldEndVNode, newEndVNode, container)
        oldEndVNode = oldChildren[--oldEndIdx]
        newEndVNode = newChildren[--newEndIdx]
      } else if (isSameKey(oldStartVNode, newEndVNode)) {
        patch(oldStartVNode, newEndVNode, container)
        insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)
        oldStartVNode = oldChildren[++oldStartIdx]
        newEndVNode = newChildren[--newEndIdx]
      } else if (isSameKey(oldEndVNode, newStartVNode)) {
        patch(oldEndVNode, newStartVNode, container)
        insert(oldEndVNode.el, container, oldStartVNode.el)
        oldEndVNode = oldChildren[--oldEndIdx]
        newStartVNode = newChildren[++newStartIdx]
      } else {
        // 遍历旧的一组子节点, 视图寻找与newStartVNode拥有相同key值的节点
        const idxInOld = oldChildren.findIndex((node) => node.key === newStartVNode.key)
        if (idxInOld > 0) {
          const vnodeToMove = oldChildren[idxInOld]
          patch(vnodeToMove, newStartVNode, container)
          insert(vnodeToMove.el, container, oldStartVNode.el)
          oldChildren[idxInOld] = undefined
        } else {
          // 新增
          patch(null, newStartVNode, container, oldStartVNode.el)
        }
        newStartVNode = newChildren[++newStartIdx]
      }
    }
    if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
      for (let i = newStartIdx; i <= newEndIdx; i++) {
        patch(null, newChildren[i], container, oldStartVNode.el)
      }
    } else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        unmount(oldChildren[i])
      }
    }
  }
  return {
    render
    // hydrate
  }
}
export const renderOptions = {
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  createText(text) {
    return document.createTextNode(text)
  },
  setText(el, text) {
    el.nodeValue = text
  },
  createComment(comment) {
    return document.createComment(comment)
  },
  setComment(comment) {
    el.nodeValue = comment
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  unmount(vnode) {
    if (vnode.type === FRAGMENT) {
      vnode.children.forEach((c) => renderOptions.unmount(c))
      return
    }
    const parent = vnode.el.parentNode
    if (parent) {
      parent.removeChild(vnode.el)
    }
  },
  shouldSetAsProps(el, key) {
    if (key === 'form' && el.tagName === 'INPUT') return false
    return key in el
  },
  patchProps(el, key, preValue, nextValue) {
    // 使用el.className 代替 setAttribute 性能更好
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {})
      let invoker = invokers[key]
      const name = key.slice(2).toLowerCase()
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[key] = (e) => {
            // e.timeStamp 时间发生的时间
            // 如果时间发生的时间早于事件处理函数绑定的时间, 则不执行事件处理函数
            if (e.timeStamp < invoker.attached) return
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => fn(e))
            } else {
              invoker.value(e)
            }
          }
          invoker.value = nextValue
          invoker.attached = performance.now()
          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key === 'class') {
      // el.className 效率比setAttribute高
      el.className = nextValue || ''
    } else if (renderOptions.shouldSetAsProps(el, key)) {
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
}

function isSameKey(n1, n2) {
  return n1?.key === n2?.key
}

function easyDiff() {
  const oldChildren = n1.children
  const newChildren = n2.children
  const oldLen = oldChildren.length
  const newLen = newChildren.length
  // 用来存储寻找过程中遇到的最大索引值
  let lastIndex = 0
  for (let i = 0; i < newLen; i++) {
    const newVNode = newChildren[i]
    let j = 0
    // find代表是否在旧的一组节点中找到可以复用的节点
    let find = false
    for (j; j < oldLen; j++) {
      const oldVNode = oldChildren[j]
      if (newVNode.key === oldVNode.key) {
        find = true
        patch(oldVNode, newVNode, container)
        if (j < lastIndex) {
          // 如果当前索引小于最大索引, 意味着该节点对应的真实DOM需要移动
          const preVNode = newChildren[i - 1]
          if (preVNode) {
            const anchor = preVNode.el.nextSibling
            insert(newVNode.el, container, anchor)
          }
        } else {
          lastIndex = j
        }
        break
      }
    }
    if (!find) {
      const preVNode = newChildren[i - 1]
      let anchor = null
      if (preVNode) {
        anchor = preVNode.el.nextSibling
      } else {
        anchor = container.firstChild
      }
      patch(null, newVNode, container, anchor)
    }
  }
  for (let i = 0; i < oldLen; i++) {
    const oldVNode = oldChildren[i]
    const has = newChildren.find((vnode) => vnode.key === oldVNode.key)
    if (!has) {
      unmount(oldVNode)
    }
  }
}
