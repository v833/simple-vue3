import { h } from '../../lib/guide-mini-vue-esm.js'

export default {
  name: 'Child',
  setup(props) {},
  render() {
    return h('div', {}, [h('div', {}, `child - props - msg: ${this.$props.msg}`)])
  }
}
