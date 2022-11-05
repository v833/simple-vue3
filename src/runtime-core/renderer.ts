import { effect } from '../reactivity/effect'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
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
    patch(null, vnode, container, null)
  }

  function patch(n1, n2, container, parentComponent) {
    // 处理组件
    const { type, shapeFlag } = n2

    // Fragment -> 只渲染 chidlren
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
          // 判断是不是element类型
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }
  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent) {
    // init -> update
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, parentComponent)
    }
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }
  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      const { proxy } = instance
      if (!instance.isMounted) {
        console.log('init')
        const subTree = (instance.subTree = instance.render.call(proxy))
        patch(null, subTree, container, instance)
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log('update')
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }
  function mountElement(n2: any, container: any, parentComponent) {
    const el = (n2.el = hostCreateElement(n2.type))
    const { props, children, shapeFlag } = n2
    // string array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n2.children, el, parentComponent)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }
  function patchElement(n1: any, n2: any, parentComponent) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent)
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

  function patchChildren(n1, n2, container, parentComponent) {
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
        mountChildren(c2, container, parentComponent)
      } else {
        // TODO: array to array
      }
    }
  }
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      // remove
      hostRemove(el)
    }
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }
  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.chidlren, container, parentComponent)
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
