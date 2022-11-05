import { effect } from '../reactivity/effect'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options

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
      patchElement(n1, n2, container)
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
        const preSubTree = instance.subTree
        instance.subTree = subTree
        patch(preSubTree, subTree, container, instance)
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
      mountChildren(n2, el, parentComponent)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }
  function patchElement(n1: any, n2: any, container: any) {}

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }
  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent)
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
