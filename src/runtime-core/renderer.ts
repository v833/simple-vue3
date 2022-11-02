import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vnode, container, parentComponent) {
  // patch
  patch(vnode, container, parentComponent)
}

function patch(vnode, container, parentComponent) {
  // 处理组件
  const { type, shapeFlag } = vnode

  // Fragment -> 只渲染 chidlren
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
        // 判断是不是element类型
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
      break
  }
}

function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function processElement(vnode, container, parentComponent) {
  // init -> update
  mountElement(vnode, container, parentComponent)
}

function mountComponent(initialVNode, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy, setupState } = instance
  const subTree = instance.render.call(proxy)
  // const subTree = instance.render.call(setupState)
  patch(subTree, container, instance)
  initialVNode.el = subTree.el
  // vnode -> patch
  // vnode -> element -> mountElement
}
function mountElement(vnode: any, container: any, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type))
  const { props, children, shapeFlag } = vnode
  // string array
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
  }
  for (const key in props) {
    const val = props[key]
    const isOn = /^on[A-Z]/.test(key)
    if (isOn) {
      const eventName = key.slice(2).toLowerCase()
      el.addEventListener(eventName, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent)
  })
}
function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}
function processText(vnode: any, container: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}
