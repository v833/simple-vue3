import { ref } from './reactive'

export function defineAsyncComponent(options) {
  if (typeof options === 'function') {
    options = {
      loader: options
    }
  }
  const { loader } = options
  // 存储异步加载的组件
  let InnerComp = null
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      const timeout = ref(false)
      loader().then((c) => {
        InnerComp = c
        loaded.value = true
      })
      let timer = null
      if (options.timeout) {
        timer = setTimeout(() => {
          timeout.value = true
        }, options.timeout)
      }
      onUnmounted(() => {
        clearTimeout(timer)
      })
      const placeholder = { type: Text, children }
      return () => {
        if (loaded.value) {
          return { type: InnerComp }
        } else if (timeout.value) {
          return options.errorComponent ? { type: options.errorComponent } : placeholder
        }
        return placeholder
      }
    }
  }
}
