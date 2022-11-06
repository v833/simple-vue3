import { effect } from '../reactivity/effect'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { shouldUpdateComponent } from './componentUpdateUtils'
import { createAppAPI } from './createApp'
import { getSequence } from './getSequence'
import { queueJobs } from './scheduler'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode, container) {
    patch(null, vnode, container, null, null)
  }

  function patch(n1, n2, container, parentComponent, anchor) {
    // 处理组件
    const { type, shapeFlag } = n2

    // Fragment -> 只渲染 chidlren
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
          // 判断是不是element类型
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }
  }
  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      updateComponent(n1, n2)
    }
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    // init -> update
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, parentComponent, anchor)
    }
  }

  function mountComponent(initialVNode, container, parentComponent, anchor) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ))
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component)
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      n2.el = n1.el
      n2.vnode = n2
    }
  }

  function setupRenderEffect(instance, initialVNode, container, anchor) {
    instance.update = effect(
      () => {
        const { proxy } = instance
        if (!instance.isMounted) {
          console.log('init', instance)
          // TODO: render this
          const subTree = (instance.subTree = instance.render.call(proxy))
          patch(null, subTree, container, instance, anchor)
          initialVNode.el = subTree.el
          instance.isMounted = true
        } else {
          console.log('update', instance)
          // update props 需要一个新的vnode
          const { next, vnode } = instance
          if (next) {
            next.el = vnode.el
            updateComponentPreRender(instance, next)
          }
          const subTree = instance.render.call(proxy)
          const prevSubTree = instance.subTree
          instance.subTree = subTree
          patch(prevSubTree, subTree, container, instance, anchor)
        }
      },
      {
        scheduler() {
          // nextTick
          queueJobs(instance.update)
        }
      }
    )
  }

  function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode
    instance.next = null
    instance.props = nextVNode.props
  }

  function mountElement(n2: any, container: any, parentComponent, anchor) {
    const el = (n2.el = hostCreateElement(n2.type))
    const { props, children, shapeFlag } = n2
    // string array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n2.children, el, parentComponent, anchor)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    hostInsert(el, container, anchor)
  }
  function patchElement(n1: any, n2: any, parentComponent, anchor) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  const EMPTY_OBJ = {}

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return

    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]
      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }

    if (oldProps !== EMPTY_OBJ) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const { shapeFlag: prevShapFlag, children: c1 } = n1
    const { shapeFlag: nextshapeFlag, children: c2 } = n2
    if (nextshapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的children清空
        unmountChildren(n1.children)
      }
      // 2. 设置新的text
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // TODO: array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1

    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    // 新的比老的多
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < c2.length ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
      // 老的比新的多
    } else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
      // 乱序部分 中间对比
    } else {
      // debugger
      // 1. 创建新的
      // 2. 删除老的
      // 3. 移动
      let s1 = i
      let s2 = i
      const toBePatched = e2 - s2 + 1
      let patched = 0
      const keyToNewIndexMap = new Map()
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
      let moved = false
      let maxNewIndexSoFar = 0

      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }
        let newIndex: number | null = null
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }
        if (!newIndex) {
          hostRemove(prevChild.el)
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }

          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1
      // 倒叙
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null

        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log('移动位置', nextChild.el)
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }

  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      // remove
      hostRemove(el)
    }
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor)
    })
  }
  function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
    mountChildren(n2.chidlren, container, parentComponent, anchor)
  }
  function processText(n1, n2: any, container: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  return {
    createApp: createAppAPI(render)
  }
}
