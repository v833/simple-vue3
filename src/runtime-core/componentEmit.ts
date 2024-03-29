import { camelize, toHandlerKey } from '../shared/index'

export function emit(instance, event, ...args) {
  const { props } = instance

  const eventName = toHandlerKey(camelize(event))

  const handler = props[eventName]
  handler && handler(...args)
}
