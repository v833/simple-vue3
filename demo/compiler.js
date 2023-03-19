export function createRenderer(options = {}) {
  const { createElement, insert, unmount, setElementText, patchProps } = options

  function patch(n1, n2, container) {
    // 当vnode的type不同时, 卸载旧vnode
    if (n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }
    const type = typeof n2.type
    switch (type) {
      case 'fragment':
        break
      case 'string':
        if (!n1) {
          // 新增
          mountElement(n2, container)
        } else {
          // 更新
          patchElement(n1, n2)
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

  function mountElement(vnode, container) {
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
    insert(el, container)
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
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  unmount(vnode) {
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
