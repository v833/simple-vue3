export function resolveProps(options, propsData) {
  const props = {}
  const attrs = {}

  for (const key in propsData) {
    if (key in options) {
      // 如果传递的props为自检自身定义的props, 则视为合法
      props[key] = propsData[key]
    } else {
      // 否则将其视为attrs
      attrs[key] = propsData[key]
    }
  }
  return [props, attrs]
}

export function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps)
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    if (nextProps[key] !== prevProps[key]) {
      return trye
    }
  }
  return false
}
