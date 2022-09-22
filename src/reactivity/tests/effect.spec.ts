import { reactive } from '../reactive'
import { effect } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)
  })

  it('', () => {
    let foo = 10
    const runnner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const r = runnner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })
})
