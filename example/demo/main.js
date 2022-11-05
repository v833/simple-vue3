// vue3
import { createApp } from '../../lib/guide-mini-vue-esm.js'
import { App } from './App.js'
import { Provide } from './Provide.js'

const rootContainer = document.querySelector('#app')
// debugger
createApp(Provide).mount(rootContainer)
