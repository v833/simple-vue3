import { createRenderer } from '../index'

function createElement(type) {
  return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
  const isOn = /^on[A-Z]/.test(key)
  if (isOn) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, nextVal)
  } else {
    if (nextVal == undefined) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert(el, parent) {
  parent.append(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert
})

export function createApp(...args) {
  return renderer.createApp(...args)
}
export * from '../runtime-core/index'
