import { h, provide, inject } from '../lib/guide-mini-vue-esm.js'

const Provide = {
  name: 'Provide',
  setup() {
    provide('foo', 'fooVar')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provide'), h(ProvideTwo)])
  }
}
const ProvideTwo = {
  name: 'ProvideTwo',
  setup() {
    provide('foo', 'rewrite')
    provide('fooTwo', 'fooTwo')
    const foo = inject('foo')
    return {
      foo
    }
  },
  render() {
    return h('div', {}, [h('p', {}, 'ProvideTwo ' + this.foo), h(Consumer)])
  }
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const fooTwo = inject('fooTwo')
    const bar = inject('bar', () => 'default_bar')
    return {
      foo,
      fooTwo,
      bar
    }
  },
  render() {
    return h('div', {}, `Consumer: ${this.foo} - ${this.fooTwo} - ${this.bar}`)
  }
}

export { Provide }
