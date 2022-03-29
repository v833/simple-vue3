function effect(fn) {}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}

function watch(source, cb, options = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = traverse(source)
  }

  function onInvalidate(fn) {
    cleanup = fn
  }
  const job = () => {
    cleanup && cleanup()
    newValue = effectFn()
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  let newValue, oldValue
  let cleanup
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}