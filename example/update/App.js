import { h, ref } from '../../lib/guide-mini-vue-esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })

    const onChangePropsDemo1 = () => {
      props.value.foo = 'demo2-foo'
    }

    const onChangePropsDemo2 = () => {
      props.value.foo = undefined
    }

    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'demo3-foo'
      }
    }

    return {
      count,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
      props
    }
  },
  render() {
    // this.count -> this.count.value -> proxyRef
    return h('div', { id: 'root', foo: this.props.foo, bar: this.props.bar }, [
      h('div', {}, `count: ${this.props.foo}`),
      h('button', { onClick: this.onClick }, 'click'),
      h('button', { onClick: this.onChangePropsDemo1 }, 'demo1'),
      h('button', { onClick: this.onChangePropsDemo2 }, 'demo2'),
      h('button', { onClick: this.onChangePropsDemo3 }, 'demo3')
    ])
  }
}
